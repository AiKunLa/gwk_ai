// @vitest-environment node

import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DomainError } from "@/lib/domain/errors";
import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createAssetRepository } from "@/lib/server/db/asset-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";

describe("asset repository", () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = createDatabase(":memory:");
    migrateDatabase(database);
    createArticleRepository(database).createDraft({ id: "article-1", now: 100 });
  });

  afterEach(() => {
    database.close();
  });

  it("moves a pending asset to ready after upload verification", () => {
    const repository = createAssetRepository(database);
    repository.createPending({
      id: "asset-1",
      articleId: "article-1",
      objectKey: "posts/article-1/asset-1.png",
      publicUrl: "https://cdn.example.test/posts/article-1/asset-1.png",
      originalName: "image.png",
      mimeType: "image/png",
      sizeBytes: 512,
      uploadExpiresAt: 500,
      now: 100,
    });

    expect(repository.findById("asset-1")).toMatchObject({ status: "pending" });
    expect(repository.markReady("asset-1", 200)).toMatchObject({
      status: "ready",
      readyAt: 200,
    });
  });

  it("synchronizes cover and body references and marks detached assets orphaned", () => {
    const repository = createAssetRepository(database);
    for (const id of ["asset-cover", "asset-body", "asset-old"]) {
      repository.createPending({
        id,
        articleId: "article-1",
        objectKey: `posts/article-1/${id}.png`,
        publicUrl: `https://cdn.example.test/${id}.png`,
        originalName: `${id}.png`,
        mimeType: "image/png",
        sizeBytes: 512,
        uploadExpiresAt: 500,
        now: 100,
      });
      repository.markReady(id, 150);
    }

    repository.syncArticleReferences({
      articleId: "article-1",
      bodyAssetIds: ["asset-body"],
      coverAssetId: "asset-cover",
      now: 200,
    });

    expect(repository.listArticleReferences("article-1")).toEqual([
      { assetId: "asset-cover", role: "cover", position: 0 },
      { assetId: "asset-body", role: "body", position: 0 },
    ]);
    expect(repository.findById("asset-old")).toMatchObject({ orphanedAt: 200 });
    expect(repository.findById("asset-body")).toMatchObject({ orphanedAt: null });
  });

  it("rejects references to pending or foreign assets", () => {
    const articles = createArticleRepository(database);
    const repository = createAssetRepository(database);
    articles.createDraft({ id: "article-2", now: 100 });
    repository.createPending({
      id: "foreign-pending",
      articleId: "article-2",
      objectKey: "posts/article-2/foreign.png",
      publicUrl: "https://cdn.example.test/foreign.png",
      originalName: "foreign.png",
      mimeType: "image/png",
      sizeBytes: 512,
      uploadExpiresAt: 500,
      now: 100,
    });

    expect(() =>
      repository.syncArticleReferences({
        articleId: "article-1",
        bodyAssetIds: ["foreign-pending"],
        coverAssetId: null,
        now: 200,
      }),
    ).toThrowError(expect.objectContaining<Partial<DomainError>>({ code: "ASSET_NOT_READY" }));
  });
});
