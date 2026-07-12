import { ZodError } from "zod";

import { DomainError } from "@/lib/domain/errors";

export function successResponse<T>(
  data: T,
  init?: ResponseInit,
  meta?: Record<string, number>,
): Response {
  return Response.json(
    { success: true, data, ...(meta ? { meta } : {}) },
    {
      ...init,
      headers: { "Cache-Control": "no-store", ...init?.headers },
    },
  );
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return failure(422, "VALIDATION_ERROR", "提交内容不符合要求", {
      fields: error.flatten().fieldErrors,
    });
  }

  if (error instanceof DomainError) {
    return failure(statusByCode(error.code), error.code, error.message);
  }

  console.error("Unhandled API error", error);
  return failure(500, "INTERNAL_ERROR", "服务暂时不可用，请稍后重试");
}

export function failure(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): Response {
  return Response.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function statusByCode(code: string): number {
  if (code.endsWith("_NOT_FOUND")) return 404;
  if (code === "REVISION_CONFLICT" || code === "IMAGE_LIMIT_EXCEEDED") return 409;
  if (code === "ORIGIN_NOT_ALLOWED") return 403;
  if (code === "UNSUPPORTED_MEDIA_TYPE") return 415;
  if (code === "REQUEST_TOO_LARGE") return 413;
  if (code === "RATE_LIMITED") return 429;
  if (code === "OSS_NOT_CONFIGURED") return 503;
  if (code === "INVALID_JSON") return 400;
  return 422;
}
