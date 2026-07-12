import { createArticleCollectionHandlers } from "@/lib/server/http/article-handlers";
import { getAppOrigin, getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  return createArticleCollectionHandlers({
    service: getRuntime().articleService,
    origin: getAppOrigin(),
  }).GET(request);
}

export async function POST(request: Request): Promise<Response> {
  return createArticleCollectionHandlers({
    service: getRuntime().articleService,
    origin: getAppOrigin(),
  }).POST(request);
}
