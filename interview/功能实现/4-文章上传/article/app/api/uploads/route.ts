import { createUploadCollectionHandlers } from "@/lib/server/http/upload-handlers";
import { getAppOrigin, getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request): Promise<Response> {
  return createUploadCollectionHandlers({
    service: getRuntime().uploadService,
    origin: getAppOrigin(),
  }).POST(request);
}
