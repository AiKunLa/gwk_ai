import { z } from "zod";

import {
  defaultApiRateLimiter,
  readMutationJson,
  type RateLimiter,
} from "@/lib/server/http/request-security";
import { errorResponse, failure, successResponse } from "@/lib/server/http/responses";

interface ArticleCollectionService {
  createDraft(): unknown;
  list(input: {
    status: "draft" | "published";
    limit: number;
    offset?: number;
  }): { items: unknown[]; total: number };
}

interface ArticleItemService {
  get(id: string): unknown | null;
  save(input: {
    id: string;
    expectedRevision: number;
    action: "draft" | "publish";
    title: string;
    summary: string;
    tags: readonly string[];
    content: unknown;
    coverAssetId: string | null;
  }): Promise<unknown>;
  delete(id: string): Promise<boolean>;
}

const listQuerySchema = z.object({
  status: z.enum(["draft", "published"]).default("published"),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const saveArticleSchema = z
  .object({
    expectedRevision: z.number().int().min(1),
    action: z.enum(["draft", "publish"]),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    content: z.unknown(),
    coverAssetId: z.string().uuid().nullable(),
  })
  .strict();

export function createArticleCollectionHandlers(input: {
  service: ArticleCollectionService;
  origin: string;
  rateLimiter?: RateLimiter;
}) {
  const limiter = input.rateLimiter ?? defaultApiRateLimiter;

  return {
    async GET(request: Request): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        const url = new URL(request.url);
        const query = listQuerySchema.parse({
          status: url.searchParams.get("status") ?? undefined,
          limit: url.searchParams.get("limit") ?? undefined,
          offset: url.searchParams.get("offset") ?? undefined,
        });
        const result = input.service.list(query);
        return successResponse(result.items, undefined, {
          total: result.total,
          limit: query.limit,
          offset: query.offset,
        });
      } catch (error) {
        return errorResponse(error);
      }
    },

    async POST(request: Request): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        await readMutationJson(request, input.origin);
        return successResponse(input.service.createDraft(), { status: 201 });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

export function createArticleItemHandlers(input: {
  service: ArticleItemService;
  origin: string;
  rateLimiter?: RateLimiter;
}) {
  const limiter = input.rateLimiter ?? defaultApiRateLimiter;

  return {
    async GET(
      request: Request,
      context: { params: Promise<{ id: string }> },
    ): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        const { id } = await context.params;
        const article = input.service.get(id);
        return article
          ? successResponse(article)
          : failure(404, "ARTICLE_NOT_FOUND", "文章不存在");
      } catch (error) {
        return errorResponse(error);
      }
    },

    async PATCH(
      request: Request,
      context: { params: Promise<{ id: string }> },
    ): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        const body = saveArticleSchema.parse(
          await readMutationJson(request, input.origin),
        );
        const { id } = await context.params;
        const article = await input.service.save({ id, ...body });
        return successResponse(article);
      } catch (error) {
        return errorResponse(error);
      }
    },

    async DELETE(
      request: Request,
      context: { params: Promise<{ id: string }> },
    ): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        await readMutationJson(request, input.origin);
        const { id } = await context.params;
        const deleted = await input.service.delete(id);
        return deleted
          ? successResponse({ deleted: true })
          : failure(404, "ARTICLE_NOT_FOUND", "文章不存在");
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}
