import { createUploadItemHandlers } from "@/lib/server/http/upload-handlers";
import { getAppOrigin, getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export function POST(request: Request, context: Context): Promise<Response> {
  return createUploadItemHandlers({
    service: getRuntime().uploadService,
    origin: getAppOrigin(),
  }).POST(request, context);
}
