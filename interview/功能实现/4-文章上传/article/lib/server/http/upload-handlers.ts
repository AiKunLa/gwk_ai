import { z } from "zod";

import {
  readMutationJson,
  uploadRateLimiter,
  type RateLimiter,
} from "@/lib/server/http/request-security";
import { errorResponse, successResponse } from "@/lib/server/http/responses";
interface UploadCollectionService {
  createIntent(input: {
    articleId: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
  }): Promise<unknown>;
}

interface UploadItemService {
  complete(id: string): Promise<unknown>;
}

const createUploadSchema = z
  .object({
    articleId: z.string().uuid(),
    fileName: z.string(),
    contentType: z.string(),
    sizeBytes: z.number(),
  })
  .strict();

export function createUploadCollectionHandlers(input: {
  service: UploadCollectionService;
  origin: string;
  rateLimiter?: RateLimiter;
}) {
  const limiter = input.rateLimiter ?? uploadRateLimiter;

  return {
    async POST(request: Request): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        const body = createUploadSchema.parse(
          await readMutationJson(request, input.origin),
        );
        return successResponse(await input.service.createIntent(body), {
          status: 201,
        });
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}

export function createUploadItemHandlers(input: {
  service: UploadItemService;
  origin: string;
  rateLimiter?: RateLimiter;
}) {
  const limiter = input.rateLimiter ?? uploadRateLimiter;

  return {
    async POST(
      request: Request,
      context: { params: Promise<{ id: string }> },
    ): Promise<Response> {
      try {
        limiter.assertAllowed(request);
        await readMutationJson(request, input.origin);
        const { id } = await context.params;
        return successResponse(await input.service.complete(id));
      } catch (error) {
        return errorResponse(error);
      }
    },
  };
}
