// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";
import { DomainError } from "@/lib/domain/errors";
import {
  createArticleCollectionHandlers,
  createArticleItemHandlers,
} from "@/lib/server/http/article-handlers";
import {
  createUploadCollectionHandlers,
  createUploadItemHandlers,
} from "@/lib/server/http/upload-handlers";

const origin = "http://127.0.0.1:3000";

function jsonRequest(path: string, body: unknown, method = "POST") {
  return new Request(`${origin}${path}`, {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("article HTTP handlers", () => {
  it("creates a draft with a 201 response envelope", async () => {
    const service = {
      createDraft: vi.fn(() => ({ id: "article-1", revision: 1, status: "draft" })),
      list: vi.fn(),
    };
    const handlers = createArticleCollectionHandlers({ service, origin });

    const response = await handlers.POST(jsonRequest("/api/articles", {}));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { id: "article-1", revision: 1, status: "draft" },
    });
  });

  it("lists published articles with pagination metadata", async () => {
    const service = {
      createDraft: vi.fn(),
      list: vi.fn(() => ({ items: [{ id: "article-1" }], total: 1 })),
    };
    const handlers = createArticleCollectionHandlers({ service, origin });

    const response = await handlers.GET(
      new Request(`${origin}/api/articles?status=published&limit=10&offset=0`),
    );

    expect(service.list).toHaveBeenCalledWith({
      status: "published",
      limit: 10,
      offset: 0,
    });
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: [{ id: "article-1" }],
      meta: { total: 1, limit: 10, offset: 0 },
    });
  });

  it("rejects cross-origin writes before calling the service", async () => {
    const service = { createDraft: vi.fn(), list: vi.fn() };
    const handlers = createArticleCollectionHandlers({ service, origin });
    const request = new Request(`${origin}/api/articles`, {
      method: "POST",
      headers: {
        Origin: "https://attacker.example",
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    const response = await handlers.POST(request);

    expect(response.status).toBe(403);
    expect(service.createDraft).not.toHaveBeenCalled();
  });

  it("maps invalid save bodies and revision conflicts without exposing details", async () => {
    const service = {
      get: vi.fn(),
      save: vi
        .fn()
        .mockRejectedValueOnce(new DomainError("stale", "REVISION_CONFLICT")),
      delete: vi.fn(),
    };
    const handlers = createArticleItemHandlers({ service, origin });
    const context = { params: Promise.resolve({ id: "article-1" }) };

    const invalidResponse = await handlers.PATCH(
      jsonRequest("/api/articles/article-1", { title: "missing fields" }, "PATCH"),
      context,
    );
    expect(invalidResponse.status).toBe(422);

    const conflictResponse = await handlers.PATCH(
      jsonRequest(
        "/api/articles/article-1",
        {
          expectedRevision: 1,
          action: "draft",
          title: "Title",
          summary: "",
          tags: [],
          content: EMPTY_TIPTAP_DOCUMENT,
          coverAssetId: null,
        },
        "PATCH",
      ),
      context,
    );
    expect(conflictResponse.status).toBe(409);
    const body = await conflictResponse.json();
    expect(body).toMatchObject({
      success: false,
      error: { code: "REVISION_CONFLICT" },
    });
    expect(JSON.stringify(body)).not.toContain("stack");
  });
});

describe("upload HTTP handlers", () => {
  it("creates and completes a validated upload intent", async () => {
    const service = {
      createIntent: vi.fn(async () => ({ asset: { id: "asset-1" }, upload: { fields: {} } })),
      complete: vi.fn(async () => ({ id: "asset-1", status: "ready" })),
    };
    const collection = createUploadCollectionHandlers({ service, origin });
    const item = createUploadItemHandlers({ service, origin });

    const createResponse = await collection.POST(
      jsonRequest("/api/uploads", {
        articleId: "00000000-0000-4000-8000-000000000001",
        fileName: "image.png",
        contentType: "image/png",
        sizeBytes: 100,
      }),
    );
    expect(createResponse.status).toBe(201);

    const completeResponse = await item.POST(
      jsonRequest("/api/uploads/asset-1/complete", {}),
      { params: Promise.resolve({ id: "asset-1" }) },
    );
    expect(completeResponse.status).toBe(200);
    await expect(completeResponse.json()).resolves.toMatchObject({
      success: true,
      data: { status: "ready" },
    });
  });
});
