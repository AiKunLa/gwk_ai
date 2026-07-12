// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GET, POST } from "@/app/api/test-oss/route";
import {
  fakeObjects,
  FakeObjectStorage,
} from "@/lib/server/storage/fake-object-storage";

const origin = "http://127.0.0.1:3000";
const uploadToken = "test-run-token";
const objectKey =
  "posts/00000000-0000-4000-8000-000000000001/00000000-0000-4000-8000-000000000002.png";

describe("test OSS route", () => {
  beforeEach(() => {
    process.env.E2E_FAKE_OSS = "1";
    process.env.E2E_FAKE_OSS_TOKEN = uploadToken;
    process.env.APP_ORIGIN = origin;
    fakeObjects.clear();
  });

  afterEach(() => {
    delete process.env.E2E_FAKE_OSS;
    delete process.env.E2E_FAKE_OSS_TOKEN;
    delete process.env.APP_ORIGIN;
    fakeObjects.clear();
  });

  it("keeps a validated image private until the upload service publishes it", async () => {
    const uploadResponse = await POST(createUploadRequest());
    expect(uploadResponse.status).toBe(200);
    expect((await POST(createUploadRequest())).status).toBe(409);

    const publicRequest = new Request(
      `${origin}/api/test-oss?key=${encodeURIComponent(objectKey)}`,
    );
    expect((await GET(publicRequest)).status).toBe(404);

    await new FakeObjectStorage(origin).publishObject(objectKey);
    const publishedResponse = GET(publicRequest);
    expect(publishedResponse.status).toBe(200);
    expect(publishedResponse.headers.get("content-type")).toBe("image/png");
  });

  it("rejects untrusted origins, tokens, and non-image uploads", async () => {
    expect(
      (await POST(createUploadRequest({ requestOrigin: "https://attacker.example" }))).status,
    ).toBe(403);
    expect((await POST(createUploadRequest({ token: "wrong-token" }))).status).toBe(403);
    expect(
      (await POST(createUploadRequest({ contentType: "text/html" }))).status,
    ).toBe(400);
    expect(fakeObjects.size).toBe(0);
  });
});

function createUploadRequest(
  overrides: {
    requestOrigin?: string;
    token?: string;
    contentType?: string;
  } = {},
): Request {
  const contentType = overrides.contentType ?? "image/png";
  const form = new FormData();
  form.set("key", objectKey);
  form.set("Content-Type", contentType);
  form.set("x-e2e-upload-token", overrides.token ?? uploadToken);
  form.set("file", new File(["image-bytes"], "image.png", { type: contentType }));
  return new Request(`${origin}/api/test-oss`, {
    method: "POST",
    headers: { Origin: overrides.requestOrigin ?? origin },
    body: form,
  });
}
