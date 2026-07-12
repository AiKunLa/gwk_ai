// @vitest-environment node

import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";
import { DomainError } from "@/lib/domain/errors";
import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createAssetRepository } from "@/lib/server/db/asset-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";
import { createArticleService } from "@/lib/server/services/article-service";

describe("article service", () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = createDatabase(":memory:");
    migrateDatabase(database);
  });

  afterEach(() => {
    database.close();
  });

  function setup() {
    const articleRepository = createArticleRepository(database);
    const assetRepository = createAssetRepository(database);
    const deleteObjects = vi.fn(async () => undefined);
    const service = createArticleService({
      database,
      articleRepository,
      assetRepository,
      deleteObjects,
      createId: () => "article-1",
      now: () => 1_700_000_000_000,
    });
    return { service, articleRepository, assetRepository, deleteObjects };
  }

  it("creates a draft before editing or uploading", () => {
    const { service } = setup();

    expect(service.createDraft()).toMatchObject({
      id: "article-1",
      revision: 1,
      status: "draft",
      content: EMPTY_TIPTAP_DOCUMENT,
    });
  });

  it("saves a draft with a verified body image and first-image cover fallback", async () => {
    const { service, assetRepository } = setup();
    service.createDraft();
    assetRepository.createPending({
      id: "asset-1",
      articleId: "article-1",
      objectKey: "posts/article-1/asset-1.png",
      publicUrl: "https://cdn.example.test/asset-1.png",
      originalName: "asset-1.png",
      mimeType: "image/png",
      sizeBytes: 100,
      uploadExpiresAt: 1_700_000_010_000,
      now: 1_700_000_000_000,
    });
    assetRepository.markReady("asset-1", 1_700_000_000_100);
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Draft body" }] },
        {
          type: "articleImage",
          attrs: {
            assetId: "asset-1",
            src: "https://untrusted.example/ignored.png",
            alt: "Diagram",
            caption: "A useful diagram",
            align: "center",
            size: "medium",
          },
        },
      ],
    } as const;

    const saved = await service.save({
      id: "article-1",
      expectedRevision: 1,
      action: "draft",
      title: "Draft title",
      summary: "Summary",
      tags: ["Tiptap"],
      content,
      coverAssetId: null,
    });

    expect(saved).toMatchObject({
      revision: 2,
      status: "draft",
      effectiveCoverAssetId: "asset-1",
      effectiveCoverUrl: "https://cdn.example.test/asset-1.png",
    });
    expect(saved.content.content?.[1].attrs?.src).toBe(
      "https://cdn.example.test/asset-1.png",
    );
  });

  it("validates publication and rejects stale saves", async () => {
    const { service } = setup();
    service.createDraft();

    await expect(
      service.save({
        id: "article-1",
        expectedRevision: 1,
        action: "publish",
        title: "",
        summary: "",
        tags: [],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).rejects.toThrow();

    const published = await service.save({
      id: "article-1",
      expectedRevision: 1,
      action: "publish",
      title: "Published title",
      summary: "",
      tags: [],
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Published body" }] },
        ],
      },
      coverAssetId: null,
    });
    expect(published).toMatchObject({ status: "published", revision: 2 });

    await expect(
      service.save({
        id: "article-1",
        expectedRevision: 1,
        action: "draft",
        title: "Stale",
        summary: "",
        tags: [],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).rejects.toThrowError(
      expect.objectContaining<Partial<DomainError>>({ code: "REVISION_CONFLICT" }),
    );
  });

  it("moves a published article back to draft when saving unpublished edits", async () => {
    const { service } = setup();
    service.createDraft();
    const published = await service.save({
      id: "article-1",
      expectedRevision: 1,
      action: "publish",
      title: "Published title",
      summary: "Public summary",
      tags: [],
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Published body" }] },
        ],
      },
      coverAssetId: null,
    });

    const draft = await service.save({
      id: "article-1",
      expectedRevision: published.revision,
      action: "draft",
      title: "Unpublished revision",
      summary: "Draft summary",
      tags: [],
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Draft body" }] },
        ],
      },
      coverAssetId: null,
    });

    expect(draft).toMatchObject({
      status: "draft",
      title: "Unpublished revision",
      publishedAt: null,
    });
    expect(service.list({ status: "published", limit: 10 }).items).toEqual([]);
    expect(service.list({ status: "draft", limit: 10 }).items).toHaveLength(1);
  });

  it("queues owned image keys before deleting an article and processes them", async () => {
    const { service, assetRepository, deleteObjects } = setup();
    service.createDraft();
    assetRepository.createPending({
      id: "asset-1",
      articleId: "article-1",
      objectKey: "posts/article-1/asset-1.png",
      publicUrl: "https://cdn.example.test/asset-1.png",
      originalName: "asset-1.png",
      mimeType: "image/png",
      sizeBytes: 100,
      uploadExpiresAt: 1_700_000_010_000,
      now: 1_700_000_000_000,
    });

    expect(await service.delete("article-1")).toBe(true);
    expect(deleteObjects).toHaveBeenCalledWith(["posts/article-1/asset-1.png"]);
    expect(service.get("article-1")).toBeNull();
  });
});
