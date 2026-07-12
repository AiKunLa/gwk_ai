// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { DomainError } from "@/lib/domain/errors";
import { errorResponse, failure, successResponse } from "@/lib/server/http/responses";

describe("HTTP responses", () => {
  it("builds success and explicit failure envelopes", async () => {
    const success = successResponse(
      [{ id: "one" }],
      { status: 201, headers: { "X-Test": "yes" } },
      { total: 1 },
    );
    expect(success.status).toBe(201);
    expect(success.headers.get("cache-control")).toBe("no-store");
    expect(success.headers.get("x-test")).toBe("yes");
    await expect(success.json()).resolves.toEqual({
      success: true,
      data: [{ id: "one" }],
      meta: { total: 1 },
    });

    const explicit = failure(418, "TEAPOT", "short and stout", { field: "tea" });
    expect(explicit.status).toBe(418);
    await expect(explicit.json()).resolves.toMatchObject({
      success: false,
      error: { code: "TEAPOT", details: { field: "tea" } },
    });
  });

  it("maps schema validation to 422 with field errors", async () => {
    const error = z.object({ title: z.string().min(1) }).safeParse({ title: "" });
    if (error.success) throw new Error("Expected validation failure");

    const response = errorResponse(error.error);
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "VALIDATION_ERROR", details: { fields: { title: expect.any(Array) } } },
    });
  });

  it.each([
    ["ARTICLE_NOT_FOUND", 404],
    ["REVISION_CONFLICT", 409],
    ["IMAGE_LIMIT_EXCEEDED", 409],
    ["ORIGIN_NOT_ALLOWED", 403],
    ["UNSUPPORTED_MEDIA_TYPE", 415],
    ["REQUEST_TOO_LARGE", 413],
    ["RATE_LIMITED", 429],
    ["OSS_NOT_CONFIGURED", 503],
    ["INVALID_JSON", 400],
    ["OTHER_DOMAIN_ERROR", 422],
  ])("maps %s to HTTP %s", (code, status) => {
    expect(errorResponse(new DomainError("safe", code)).status).toBe(status);
  });

  it("hides unexpected errors behind a generic 500 response", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = errorResponse(new Error("database path and secret"));

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("database path");
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
