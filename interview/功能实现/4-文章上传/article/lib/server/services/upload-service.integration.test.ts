// @vitest-environment node

import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createAssetRepository } from "@/lib/server/db/asset-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";
import type { ObjectStorage } from "@/lib/server/storage/object-storage";
import { createUploadService } from "@/lib/server/services/upload-service";

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nGQAAAAASUVORK5CYII=",
  "base64",
);

describe("upload service", () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = createDatabase(":memory:");
    migrateDatabase(database);
    createArticleRepository(database).createDraft({ id: "article-1", now: 100 });
  });

  afterEach(() => {
    database.close();
  });

  it("creates a server-owned key and only marks the asset ready after inspection", async () => {
    const createUpload = vi.fn(async ({ objectKey }: { objectKey: string }) => ({
      uploadUrl: "https://upload.example.test",
      publicUrl: `https://cdn.example.test/${objectKey}`,
      expiresAt: "2026-07-10T12:02:00.000Z",
      fields: { key: objectKey },
    }));
    const inspectObject = vi.fn(async () => ({
      contentType: "image/png",
      sizeBytes: onePixelPng.byteLength,
      prefix: onePixelPng,
    }));
    const publishObject = vi.fn(async () => undefined);
    const storage: ObjectStorage = {
      createUpload,
      inspectObject,
      publishObject,
      deleteObjects: vi.fn(async () => undefined),
    };
    const service = createUploadService({
      articleRepository: createArticleRepository(database),
      assetRepository: createAssetRepository(database),
      storage,
      createId: () => "asset-1",
      now: () => 1_700_000_000_000,
    });

    const intent = await service.createIntent({
      articleId: "article-1",
      fileName: "diagram.png",
      contentType: "image/png",
      sizeBytes: onePixelPng.byteLength,
    });

    expect(createUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        objectKey: "posts/article-1/asset-1.png",
        contentType: "image/png",
      }),
    );
    expect(intent.asset).toMatchObject({ id: "asset-1", status: "pending" });
    expect(publishObject).not.toHaveBeenCalled();

    const completed = await service.complete("asset-1");
    expect(inspectObject).toHaveBeenCalledWith("posts/article-1/asset-1.png");
    expect(publishObject).toHaveBeenCalledWith("posts/article-1/asset-1.png");
    expect(completed).toMatchObject({ id: "asset-1", status: "ready" });
  });

  it("rejects uploads for an unknown article", async () => {
    const storage: ObjectStorage = {
      createUpload: vi.fn(),
      inspectObject: vi.fn(),
      publishObject: vi.fn(),
      deleteObjects: vi.fn(),
    };
    const service = createUploadService({
      articleRepository: createArticleRepository(database),
      assetRepository: createAssetRepository(database),
      storage,
      createId: () => "asset-1",
      now: () => 100,
    });

    await expect(
      service.createIntent({
        articleId: "missing",
        fileName: "diagram.png",
        contentType: "image/png",
        sizeBytes: 100,
      }),
    ).rejects.toThrow();
  });
});
