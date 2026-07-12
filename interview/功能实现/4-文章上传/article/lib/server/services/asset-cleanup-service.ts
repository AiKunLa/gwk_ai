import type { DatabaseSync } from "node:sqlite";

import type { createAssetRepository } from "@/lib/server/db/asset-repository";
import { runInTransaction } from "@/lib/server/db/database";

const PENDING_TTL_MS = 24 * 60 * 60 * 1_000;
const ORPHAN_TTL_MS = 60 * 60 * 1_000;

type AssetRepository = ReturnType<typeof createAssetRepository>;

export function createAssetCleanupService(dependencies: {
  database: DatabaseSync;
  assetRepository: AssetRepository;
  deleteObjects: (objectKeys: readonly string[]) => Promise<void>;
  now: () => number;
}) {
  const { database, assetRepository, deleteObjects, now } = dependencies;

  return {
    async run(limit = 50): Promise<{ queued: number; deleted: number }> {
      const currentTime = now();
      const queued = runInTransaction(database, () =>
        assetRepository.enqueueExpiredAssets({
          now: currentTime,
          pendingTtlMs: PENDING_TTL_MS,
          orphanTtlMs: ORPHAN_TTL_MS,
          limit,
        }),
      );
      const jobs = assetRepository.listDueDeleteJobs(currentTime, limit);
      if (jobs.length === 0) return { queued, deleted: 0 };

      const objectKeys = jobs.map((job) => job.objectKey);
      try {
        await deleteObjects(objectKeys);
        assetRepository.completeCleanupJobs(jobs);
        return { queued, deleted: jobs.length };
      } catch (error) {
        const message = error instanceof Error ? error.message : "OSS delete failed";
        assetRepository.failDeleteJobs(objectKeys, message, currentTime);
        return { queued, deleted: 0 };
      }
    },
  };
}

export type AssetCleanupService = ReturnType<typeof createAssetCleanupService>;
