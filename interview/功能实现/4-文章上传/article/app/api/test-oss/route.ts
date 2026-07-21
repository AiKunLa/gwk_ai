import { parseImageUploadIntent } from "@/lib/domain/image-policy";
import { putFakeObject, fakeObjects } from "@/lib/server/storage/fake-object-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FAKE_OBJECTS = 100;
const objectKeyPattern =
  /^posts\/[0-9a-f]{8}-[0-9a-f-]{27}\/[0-9a-f]{8}-[0-9a-f-]{27}\.(?:jpg|png|webp|gif)$/i;

export async function POST(request: Request): Promise<Response> {
  if (process.env.E2E_FAKE_OSS !== "1") return new Response(null, { status: 404 });
  const allowedOrigin = process.env.APP_ORIGIN || "http://127.0.0.1:3000";
  const expectedToken = process.env.E2E_FAKE_OSS_TOKEN;
  if (request.headers.get("origin") !== allowedOrigin || !expectedToken) {
    return new Response(null, { status: 403 });
  }

  const form = await request.formData();
  const key = form.get("key");
  const contentType = form.get("Content-Type");
  const token = form.get("x-e2e-upload-token");
  const file = form.get("file");
  if (token !== expectedToken) return new Response(null, { status: 403 });
  if (typeof key !== "string" || typeof contentType !== "string" || !(file instanceof File)) {
    return new Response(null, { status: 400 });
  }
  if (!objectKeyPattern.test(key) || file.type !== contentType) {
    return new Response(null, { status: 400 });
  }
  try {
    parseImageUploadIntent({
      fileName: key.split("/").at(-1) ?? "",
      contentType,
      sizeBytes: file.size,
    });
  } catch {
    return new Response(null, { status: 400 });
  }
  if (fakeObjects.has(key)) return new Response(null, { status: 409 });
  if (fakeObjects.size >= MAX_FAKE_OBJECTS) {
    return new Response(null, { status: 429 });
  }
  putFakeObject(key, contentType, new Uint8Array(await file.arrayBuffer()));
  return new Response(null, { status: 200 });
}

export function GET(request: Request): Response {
  if (process.env.E2E_FAKE_OSS !== "1") return new Response(null, { status: 404 });
  const key = new URL(request.url).searchParams.get("key");
  const object = key ? fakeObjects.get(key) : undefined;
  if (!object?.isPublic) return new Response(null, { status: 404 });
  const body = object.content.slice().buffer as ArrayBuffer;
  return new Response(body, {
    headers: {
      "Content-Type": object.contentType,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
