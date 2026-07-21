// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { MAX_IMAGE_SIZE_BYTES } from "@/lib/domain/image-policy";
import { createPostObjectUpload } from "@/lib/server/storage/oss-policy";

describe("createPostObjectUpload", () => {
  it("creates a short-lived form policy constrained to key, MIME, and size", () => {
    const calculatePostSignature = vi.fn(() => ({
      OSSAccessKeyId: "test-access-key-id",
      Signature: "signed-value",
      policy: "encoded-policy",
    }));
    const now = new Date("2026-07-10T12:00:00.000Z");

    const result = createPostObjectUpload({
      config: {
        region: "oss-cn-hangzhou",
        bucket: "article-demo",
        publicBaseUrl: "https://cdn.example.test",
        stsToken: null,
      },
      objectKey: "posts/article-1/asset-1.png",
      contentType: "image/png",
      now,
      calculatePostSignature,
    });

    expect(result).toEqual({
      uploadUrl: "https://article-demo.oss-cn-hangzhou.aliyuncs.com",
      publicUrl: "https://cdn.example.test/posts/article-1/asset-1.png",
      expiresAt: "2026-07-10T12:02:00.000Z",
      fields: {
        key: "posts/article-1/asset-1.png",
        OSSAccessKeyId: "test-access-key-id",
        Signature: "signed-value",
        policy: "encoded-policy",
        success_action_status: "200",
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "x-oss-object-acl": "private",
        "x-oss-forbid-overwrite": "true",
      },
    });

    expect(calculatePostSignature).toHaveBeenCalledWith({
      expiration: "2026-07-10T12:02:00.000Z",
      conditions: expect.arrayContaining([
        { bucket: "article-demo" },
        ["eq", "$key", "posts/article-1/asset-1.png"],
        ["eq", "$Content-Type", "image/png"],
        ["eq", "$x-oss-object-acl", "private"],
        ["eq", "$x-oss-forbid-overwrite", "true"],
        ["content-length-range", 1, MAX_IMAGE_SIZE_BYTES],
        ["eq", "$success_action_status", "200"],
      ]),
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  it("adds an STS token and supports a custom upload endpoint", () => {
    const result = createPostObjectUpload({
      config: {
        region: "oss-cn-shanghai",
        bucket: "article-demo",
        endpoint: "https://upload.example.test/",
        publicBaseUrl: "https://cdn.example.test/",
        stsToken: "temporary-token",
      },
      objectKey: "posts/a/b.webp",
      contentType: "image/webp",
      now: new Date("2026-07-10T12:00:00.000Z"),
      calculatePostSignature: () => ({
        OSSAccessKeyId: "temporary-key",
        Signature: "signature",
        policy: "policy",
      }),
    });

    expect(result.uploadUrl).toBe("https://upload.example.test");
    expect(result.publicUrl).toBe("https://cdn.example.test/posts/a/b.webp");
    expect(result.fields["x-oss-security-token"]).toBe("temporary-token");
  });
});
