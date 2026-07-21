// @vitest-environment node

import { describe, expect, it } from "vitest";

import { MAX_ARTICLE_IMAGES } from "@/lib/domain/image-policy";
import {
  createMemoryRateLimiter,
  UPLOAD_RATE_LIMIT_REQUESTS_PER_MINUTE,
} from "@/lib/server/http/request-security";

describe("request rate limiting", () => {
  it("allows a complete maximum-size image batch with retry headroom", () => {
    expect(UPLOAD_RATE_LIMIT_REQUESTS_PER_MINUTE).toBeGreaterThanOrEqual(
      MAX_ARTICLE_IMAGES * 3,
    );
  });

  it("limits each client within the window and releases expired requests", () => {
    let currentTime = 1_000;
    const limiter = createMemoryRateLimiter({
      maxRequests: 2,
      windowMs: 1_000,
      now: () => currentTime,
    });
    const request = new Request("http://127.0.0.1:3000/api/uploads", {
      headers: { "x-forwarded-for": "203.0.113.10, 127.0.0.1" },
    });

    expect(() => limiter.assertAllowed(request)).not.toThrow();
    expect(() => limiter.assertAllowed(request)).not.toThrow();
    expect(() => limiter.assertAllowed(request)).toThrowError(
      expect.objectContaining({ code: "RATE_LIMITED" }),
    );

    currentTime += 1_000;
    expect(() => limiter.assertAllowed(request)).not.toThrow();
  });

  it("does not let a loopback client bypass limits by rotating forwarded headers", () => {
    const limiter = createMemoryRateLimiter({ maxRequests: 1, windowMs: 60_000 });
    const firstRequest = new Request("http://127.0.0.1:3000/api/articles", {
      headers: { "x-forwarded-for": "203.0.113.1" },
    });
    const secondRequest = new Request("http://127.0.0.1:3000/api/articles", {
      headers: { "x-forwarded-for": "203.0.113.2" },
    });

    limiter.assertAllowed(firstRequest);
    expect(() => limiter.assertAllowed(secondRequest)).toThrowError(
      expect.objectContaining({ code: "RATE_LIMITED" }),
    );
  });
});
