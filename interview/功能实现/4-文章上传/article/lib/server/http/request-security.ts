import { DomainError } from "@/lib/domain/errors";
import { MAX_ARTICLE_IMAGES } from "@/lib/domain/image-policy";

const MAX_JSON_BODY_BYTES = 600_000;
export const UPLOAD_RATE_LIMIT_REQUESTS_PER_MINUTE = MAX_ARTICLE_IMAGES * 3;

export async function readMutationJson(
  request: Request,
  allowedOrigin: string,
): Promise<unknown> {
  const origin = request.headers.get("origin");
  if (origin !== allowedOrigin) {
    throw new DomainError("请求来源不受信任", "ORIGIN_NOT_ALLOWED");
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  if (contentType !== "application/json") {
    throw new DomainError("接口仅接受 JSON", "UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BODY_BYTES) {
    throw new DomainError("请求内容过大", "REQUEST_TOO_LARGE");
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_JSON_BODY_BYTES) {
    throw new DomainError("请求内容过大", "REQUEST_TOO_LARGE");
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new DomainError("JSON 格式不合法", "INVALID_JSON");
  }
}

export interface RateLimiter {
  assertAllowed(request: Request): void;
}

export function createMemoryRateLimiter(input: {
  maxRequests: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const requestsByClient = new Map<string, number[]>();
  const now = input.now ?? Date.now;

  return {
    assertAllowed() {
      const client = "local";
      const currentTime = now();
      const recentRequests = (requestsByClient.get(client) ?? []).filter(
        (timestamp) => currentTime - timestamp < input.windowMs,
      );

      if (recentRequests.length >= input.maxRequests) {
        throw new DomainError("请求过于频繁，请稍后重试", "RATE_LIMITED");
      }

      requestsByClient.set(client, [...recentRequests, currentTime]);
    },
  };
}

export const defaultApiRateLimiter = createMemoryRateLimiter({
  maxRequests: 120,
  windowMs: 60_000,
});

export const uploadRateLimiter = createMemoryRateLimiter({
  maxRequests: UPLOAD_RATE_LIMIT_REQUESTS_PER_MINUTE,
  windowMs: 60_000,
});
