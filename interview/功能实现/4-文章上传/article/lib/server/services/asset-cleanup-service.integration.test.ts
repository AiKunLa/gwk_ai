// @vitest-environment node

import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createAssetRepository } from "@/lib/server/db/asset-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";
import { createAssetCleanupService } from "@/lib/server/services/asset-cleanup-service";

const DAY_MS = 24 * 60 * 60 * 1_000;
const HOUR_MS = 60 * 60 * 1_000;

describe("asset cleanup service", () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = createDatabase(":memory:");
    migrateDatabase(database);
    createArticleRepository(database).createDraft({ id: "article-1", now: 1 });
  });

  afterEach(() => database.close());

  it("deletes stale pending and orphaned ready assets but keeps recent assets", async () => {
    const assets = createAssetRepository(database);
    const now = 2 * DAY_MS;
    createAsset(assets, "stale-pending", 1);
    createAsset(assets, "recent-pending", now - 1_000);
    createAsset(assets, "stale-ready", now - 2 * HOUR_MS);
    assets.markReady("stale-ready", now - 2 * HOUR_MS);
    const deleteObjects = vi.fn(async () => undefined);
    const service = createAssetCleanupService({
      database,
      assetRepository: assets,
      deleteObjects,
      now: () => now,
    });

    await expect(service.run()).resolves.toEqual({ queued: 2, deleted: 2 });
    expect(deleteObjects).toHaveBeenCalledWith([
      "posts/article-1/stale-pending.png",
      "posts/article-1/stale-ready.png",
    ]);
    expect(assets.findById("stale-pending")).toBeNull();
    expect(assets.findById("stale-ready")).toBeNull();
    expect(assets.findById("recent-pending")).not.toBeNull();
  });

  it("retains failed delete jobs for a later retry", async () => {
    const assets = createAssetRepository(database);
    createAsset(assets, "stale-pending", 1);
    const service = createAssetCleanupService({
      database,
      assetRepository: assets,
      deleteObjects: vi.fn(async () => {
        throw new Error("temporary OSS failure");
      }),
      now: () => 2 * DAY_MS,
    });

    await expect(service.run()).resolves.toEqual({ queued: 1, deleted: 0 });
    expect(assets.findById("stale-pending")).toMatchObject({
      status: "delete_pending",
      lastDeleteError: null,
    });
  });
});

function createAsset(
  repository: ReturnType<typeof createAssetRepository>,
  id: string,
  now: number,
) {
  repository.createPending({
    id,
    articleId: "article-1",
    objectKey: `posts/article-1/${id}.png`,
    publicUrl: `https://cdn.example.test/${id}.png`,
    originalName: `${id}.png`,
    mimeType: "image/png",
    sizeBytes: 10,
    uploadExpiresAt: now + 120_000,
    now,
  });
}
