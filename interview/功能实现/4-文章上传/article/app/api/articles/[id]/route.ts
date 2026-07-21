import { createArticleItemHandlers } from "@/lib/server/http/article-handlers";
import { getAppOrigin, getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function handlers() {
  return createArticleItemHandlers({
    service: getRuntime().articleService,
    origin: getAppOrigin(),
  });
}

export function GET(request: Request, context: Context): Promise<Response> {
  return handlers().GET(request, context);
}

export function PATCH(request: Request, context: Context): Promise<Response> {
  return handlers().PATCH(request, context);
}

export function DELETE(request: Request, context: Context): Promise<Response> {
  return handlers().DELETE(request, context);
}
