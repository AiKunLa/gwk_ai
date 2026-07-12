import type { DatabaseSync } from "node:sqlite";

import { assertImageCountWithinLimit } from "@/lib/domain/image-policy";
import { DomainError } from "@/lib/domain/errors";
import { runInTransaction } from "@/lib/server/db/database";

export type AssetStatus = "pending" | "ready" | "delete_pending";

export interface AssetRecord {
  id: string;
  articleId: string;
  objectKey: string;
  publicUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  status: AssetStatus;
  createdAt: number;
  uploadExpiresAt: number;
  readyAt: number | null;
  orphanedAt: number | null;
  lastDeleteError: string | null;
}

interface AssetRow {
  id: string;
  article_id: string;
  object_key: string;
  public_url: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  status: AssetStatus;
  created_at: number;
  upload_expires_at: number;
  ready_at: number | null;
  orphaned_at: number | null;
  last_delete_error: string | null;
}

export interface CreatePendingAsset {
  id: string;
  articleId: string;
  objectKey: string;
  publicUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadExpiresAt: number;
  now: number;
}

export function createAssetRepository(database: DatabaseSync) {
  const findStatement = database.prepare("SELECT * FROM assets WHERE id = ?");
  const insertStatement = database.prepare(`
    INSERT INTO assets (
      id, article_id, object_key, public_url, original_name, mime_type,
      size_bytes, status, created_at, upload_expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `);

  function findById(id: string): AssetRecord | null {
    const row = findStatement.get(id) as unknown as AssetRow | undefined;
    return row ? mapAssetRow(row) : null;
  }

  return {
    createPending(input: CreatePendingAsset): AssetRecord {
      insertStatement.run(
        input.id,
        input.articleId,
        input.objectKey,
        input.publicUrl,
        input.originalName,
        input.mimeType,
        input.sizeBytes,
        input.now,
        input.uploadExpiresAt,
      );
      return requireAsset(findById(input.id));
    },

    findById,

    markReady(id: string, now: number): AssetRecord {
      const existing = requireAsset(findById(id));
      if (existing.status === "ready") return existing;
      if (existing.status !== "pending") {
        throw new DomainError("图片状态不允许完成上传", "INVALID_ASSET_STATE");
      }

      database
        .prepare(
          "UPDATE assets SET status = 'ready', ready_at = ?, orphaned_at = ? WHERE id = ?",
        )
        .run(now, now, id);
      return requireAsset(findById(id));
    },

    syncArticleReferences(input: {
      articleId: string;
      bodyAssetIds: readonly string[];
      coverAssetId: string | null;
      now: number;
    }): void {
      const bodyAssetIds = [...new Set(input.bodyAssetIds)];
      assertImageCountWithinLimit(bodyAssetIds, input.coverAssetId);
      const referencedAssetIds = [
        ...new Set(
          input.coverAssetId
            ? [input.coverAssetId, ...bodyAssetIds]
            : bodyAssetIds,
        ),
      ];

      for (const assetId of referencedAssetIds) {
        const asset = requireAsset(findById(assetId));
        if (asset.status !== "ready") {
          throw new DomainError("图片尚未完成上传", "ASSET_NOT_READY");
        }
        if (asset.articleId !== input.articleId) {
          throw new DomainError("图片不属于当前文章", "ASSET_OWNERSHIP_MISMATCH");
        }
      }

      runInTransaction(database, () => {
        database
          .prepare("DELETE FROM article_assets WHERE article_id = ?")
          .run(input.articleId);

        const insertReference = database.prepare(
          "INSERT INTO article_assets (article_id, asset_id, role, position) VALUES (?, ?, ?, ?)",
        );
        if (input.coverAssetId) {
          insertReference.run(input.articleId, input.coverAssetId, "cover", 0);
        }
        bodyAssetIds.forEach((assetId, position) => {
          insertReference.run(input.articleId, assetId, "body", position);
        });

        database
          .prepare(
            "UPDATE assets SET orphaned_at = ? WHERE article_id = ? AND status = 'ready'",
          )
          .run(input.now, input.articleId);

        if (referencedAssetIds.length > 0) {
          const placeholders = referencedAssetIds.map(() => "?").join(", ");
          database
            .prepare(
              `UPDATE assets SET orphaned_at = NULL WHERE article_id = ? AND id IN (${placeholders})`,
            )
            .run(input.articleId, ...referencedAssetIds);
        }
      });
    },

    listArticleReferences(articleId: string): Array<{
      assetId: string;
      role: "body" | "cover";
      position: number;
    }> {
      const rows = database
        .prepare(`
          SELECT asset_id, role, position
          FROM article_assets
          WHERE article_id = ?
          ORDER BY CASE role WHEN 'cover' THEN 0 ELSE 1 END, position ASC
        `)
        .all(articleId) as unknown as Array<{
        asset_id: string;
        role: "body" | "cover";
        position: number;
      }>;

      return rows.map((row) => ({
        assetId: row.asset_id,
        role: row.role,
        position: Number(row.position),
      }));
    },

    listByArticle(articleId: string): AssetRecord[] {
      const rows = database
        .prepare("SELECT * FROM assets WHERE article_id = ? ORDER BY created_at ASC, id ASC")
        .all(articleId) as unknown as AssetRow[];
      return rows.map(mapAssetRow);
    },

    getReadyAssetsForArticle(
      articleId: string,
      assetIds: readonly string[],
    ): AssetRecord[] {
      return [...new Set(assetIds)].map((assetId) => {
        const asset = requireAsset(findById(assetId));
        if (asset.status !== "ready") {
          throw new DomainError("图片尚未完成上传", "ASSET_NOT_READY");
        }
        if (asset.articleId !== articleId) {
          throw new DomainError("图片不属于当前文章", "ASSET_OWNERSHIP_MISMATCH");
        }
        return asset;
      });
    },

    enqueueArticleDeletion(articleId: string, now: number): string[] {
      const ownedAssets = this.listByArticle(articleId);
      const insertJob = database.prepare(`
        INSERT OR IGNORE INTO asset_delete_jobs (
          id, asset_id, object_key, not_before, next_attempt_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const asset of ownedAssets) {
        insertJob.run(
          `delete-${asset.id}`,
          asset.id,
          asset.objectKey,
          now,
          now,
          now,
        );
      }
      return ownedAssets.map((asset) => asset.objectKey);
    },

    completeDeleteJobs(objectKeys: readonly string[]): void {
      const statement = database.prepare(
        "DELETE FROM asset_delete_jobs WHERE object_key = ?",
      );
      for (const objectKey of objectKeys) statement.run(objectKey);
    },

    failDeleteJobs(objectKeys: readonly string[], error: string, now: number): void {
      const statement = database.prepare(`
        UPDATE asset_delete_jobs
        SET attempts = attempts + 1, last_error = ?, next_attempt_at = ?
        WHERE object_key = ?
      `);
      for (const objectKey of objectKeys) {
        statement.run(error.slice(0, 500), now + 60_000, objectKey);
      }
    },

    enqueueExpiredAssets(input: {
      now: number;
      pendingTtlMs: number;
      orphanTtlMs: number;
      limit: number;
    }): number {
      const rows = database
        .prepare(`
          SELECT * FROM assets
          WHERE
            (status = 'pending' AND created_at <= ?)
            OR (status = 'ready' AND orphaned_at IS NOT NULL AND orphaned_at <= ?)
          ORDER BY created_at ASC
          LIMIT ?
        `)
        .all(
          input.now - input.pendingTtlMs,
          input.now - input.orphanTtlMs,
          input.limit,
        ) as unknown as AssetRow[];
      const insertJob = database.prepare(`
        INSERT OR IGNORE INTO asset_delete_jobs (
          id, asset_id, object_key, not_before, next_attempt_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      const markPending = database.prepare(
        "UPDATE assets SET status = 'delete_pending' WHERE id = ?",
      );

      for (const row of rows) {
        insertJob.run(
          `cleanup-${row.id}`,
          row.id,
          row.object_key,
          input.now,
          input.now,
          input.now,
        );
        markPending.run(row.id);
      }
      return rows.length;
    },

    listDueDeleteJobs(now: number, limit: number): Array<{
      assetId: string | null;
      objectKey: string;
    }> {
      const rows = database
        .prepare(`
          SELECT asset_id, object_key
          FROM asset_delete_jobs
          WHERE not_before <= ? AND next_attempt_at <= ?
          ORDER BY created_at ASC
          LIMIT ?
        `)
        .all(now, now, limit) as unknown as Array<{
        asset_id: string | null;
        object_key: string;
      }>;
      return rows.map((row) => ({
        assetId: row.asset_id,
        objectKey: row.object_key,
      }));
    },

    completeCleanupJobs(
      jobs: readonly { assetId: string | null; objectKey: string }[],
    ): void {
      runInTransaction(database, () => {
        const deleteJob = database.prepare(
          "DELETE FROM asset_delete_jobs WHERE object_key = ?",
        );
        const deleteAsset = database.prepare(
          "DELETE FROM assets WHERE id = ? AND status = 'delete_pending'",
        );
        for (const job of jobs) {
          deleteJob.run(job.objectKey);
          if (job.assetId) deleteAsset.run(job.assetId);
        }
      });
    },
  };
}

function requireAsset(asset: AssetRecord | null): AssetRecord {
  if (!asset) {
    throw new DomainError("图片不存在", "ASSET_NOT_FOUND");
  }
  return asset;
}

function mapAssetRow(row: AssetRow): AssetRecord {
  return {
    id: row.id,
    articleId: row.article_id,
    objectKey: row.object_key,
    publicUrl: row.public_url,
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: Number(row.size_bytes),
    status: row.status,
    createdAt: Number(row.created_at),
    uploadExpiresAt: Number(row.upload_expires_at),
    readyAt: row.ready_at === null ? null : Number(row.ready_at),
    orphanedAt: row.orphaned_at === null ? null : Number(row.orphaned_at),
    lastDeleteError: row.last_delete_error,
  };
}
