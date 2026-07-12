import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";

import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createAssetRepository } from "@/lib/server/db/asset-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";
import { createArticleService } from "@/lib/server/services/article-service";
import { createAssetCleanupService } from "@/lib/server/services/asset-cleanup-service";
import { createUploadService } from "@/lib/server/services/upload-service";
import { LazyAliOssStorage } from "@/lib/server/storage/ali-oss-storage";
import { FakeObjectStorage } from "@/lib/server/storage/fake-object-storage";
import type { ObjectStorage } from "@/lib/server/storage/object-storage";

interface Runtime {
  database: DatabaseSync;
  articleService: ReturnType<typeof createArticleService>;
  uploadService: ReturnType<typeof createUploadService>;
  cleanupService: ReturnType<typeof createAssetCleanupService>;
}

const runtimeGlobal = globalThis as typeof globalThis & {
  __articleRuntime?: Runtime;
};

export function getRuntime(): Runtime {
  if (runtimeGlobal.__articleRuntime) return runtimeGlobal.__articleRuntime;

  const database = createDatabase(
    process.env.ARTICLE_DB_PATH || "./data/articles.db",
  );
  migrateDatabase(database);
  const articleRepository = createArticleRepository(database);
  const assetRepository = createAssetRepository(database);
  const storage = createObjectStorage();
  const now = Date.now;
  const createId = randomUUID;

  const cleanupService = createAssetCleanupService({
    database,
    assetRepository,
    deleteObjects: (objectKeys) => storage.deleteObjects(objectKeys),
    now,
  });
  const runtime: Runtime = {
    database,
    articleService: createArticleService({
      database,
      articleRepository,
      assetRepository,
      deleteObjects: (objectKeys) => storage.deleteObjects(objectKeys),
      createId,
      now,
    }),
    uploadService: createUploadService({
      articleRepository,
      assetRepository,
      storage,
      createId,
      now,
      cleanup: () => cleanupService.run(10),
    }),
    cleanupService,
  };
  runtimeGlobal.__articleRuntime = runtime;
  return runtime;
}

export function getAppOrigin(): string {
  return process.env.APP_ORIGIN || "http://127.0.0.1:3000";
}

function createObjectStorage(): ObjectStorage {
  return process.env.E2E_FAKE_OSS === "1"
    ? new FakeObjectStorage(getAppOrigin())
    : new LazyAliOssStorage();
}
