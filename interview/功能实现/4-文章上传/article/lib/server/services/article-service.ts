import type { DatabaseSync } from "node:sqlite";

import {
  canonicalizeArticleImages,
  extractImageAssetIds,
  extractPlainText,
  resolveCoverAssetId,
  type TiptapDocument,
} from "@/lib/domain/article-content";
import {
  normalizeArticleDraft,
  validateArticleForPublish,
} from "@/lib/domain/article-policy";
import { DomainError } from "@/lib/domain/errors";
import type {
  ArticleRecord,
  ArticleStatus,
  createArticleRepository,
} from "@/lib/server/db/article-repository";
import type { createAssetRepository } from "@/lib/server/db/asset-repository";
import { runInTransaction } from "@/lib/server/db/database";

type ArticleRepository = ReturnType<typeof createArticleRepository>;
type AssetRepository = ReturnType<typeof createAssetRepository>;

export interface ArticleView extends ArticleRecord {
  effectiveCoverAssetId: string | null;
  effectiveCoverUrl: string | null;
}

export interface SaveArticleInput {
  id: string;
  expectedRevision: number;
  action: "draft" | "publish";
  title: string;
  summary: string;
  tags: readonly string[];
  content: unknown;
  coverAssetId: string | null;
}

export function createArticleService(dependencies: {
  database: DatabaseSync;
  articleRepository: ArticleRepository;
  assetRepository: AssetRepository;
  deleteObjects: (objectKeys: readonly string[]) => Promise<void>;
  createId: () => string;
  now: () => number;
}) {
  const {
    database,
    articleRepository,
    assetRepository,
    deleteObjects,
    createId,
    now,
  } = dependencies;

  function toView(article: ArticleRecord): ArticleView {
    const coverReference = assetRepository
      .listArticleReferences(article.id)
      .find((reference) => reference.role === "cover");
    const coverAsset = coverReference
      ? assetRepository.findById(coverReference.assetId)
      : null;

    return {
      ...article,
      effectiveCoverAssetId: coverAsset?.id ?? null,
      effectiveCoverUrl: coverAsset?.publicUrl ?? null,
    };
  }

  return {
    createDraft(): ArticleView {
      return toView(
        articleRepository.createDraft({ id: createId(), now: now() }),
      );
    },

    get(id: string): ArticleView | null {
      const article = articleRepository.findById(id);
      return article ? toView(article) : null;
    },

    list(input: { status: ArticleStatus; limit: number; offset?: number }) {
      const result = articleRepository.list(input);
      return { ...result, items: result.items.map(toView) };
    },

    async save(input: SaveArticleInput): Promise<ArticleView> {
      const existing = articleRepository.findById(input.id);
      if (!existing) {
        throw new DomainError("文章不存在", "ARTICLE_NOT_FOUND");
      }

      const normalized =
        input.action === "publish"
          ? validateArticleForPublish({
              title: input.title,
              summary: input.summary,
              tags: input.tags,
              content: input.content,
              coverAssetId: input.coverAssetId,
            })
          : normalizeArticleDraft({
              title: input.title,
              summary: input.summary,
              tags: input.tags,
              content: input.content,
              coverAssetId: input.coverAssetId,
            });
      const bodyAssetIds = extractImageAssetIds(normalized.content);
      const effectiveCoverAssetId = resolveCoverAssetId(
        normalized.coverAssetId,
        normalized.content,
      );
      const referencedAssetIds = effectiveCoverAssetId
        ? [effectiveCoverAssetId, ...bodyAssetIds]
        : bodyAssetIds;
      const referencedAssets = assetRepository.getReadyAssetsForArticle(
        input.id,
        referencedAssetIds,
      );
      const publicUrlByAssetId = new Map(
        referencedAssets.map((asset) => [asset.id, asset.publicUrl]),
      );
      const canonicalContent = canonicalizeArticleImages(
        normalized.content,
        publicUrlByAssetId,
      );
      const currentTime = now();
      const nextStatus: ArticleStatus =
        input.action === "publish" ? "published" : "draft";
      const publishedAt =
        nextStatus === "published" ? (existing.publishedAt ?? currentTime) : null;

      const updated = runInTransaction(database, () => {
        assetRepository.syncArticleReferences({
          articleId: input.id,
          bodyAssetIds,
          coverAssetId: effectiveCoverAssetId,
          now: currentTime,
        });
        return articleRepository.update({
          id: input.id,
          expectedRevision: input.expectedRevision,
          title: normalized.title,
          summary: normalized.summary,
          tags: normalized.tags,
          content: canonicalContent,
          contentText: extractPlainText(canonicalContent),
          status: nextStatus,
          coverAssetId: normalized.coverAssetId,
          publishedAt,
          now: currentTime,
        });
      });

      return toView(updated);
    },

    async delete(id: string): Promise<boolean> {
      if (!articleRepository.findById(id)) return false;
      const currentTime = now();
      const objectKeys = runInTransaction(database, () => {
        const keys = assetRepository.enqueueArticleDeletion(id, currentTime);
        articleRepository.delete(id);
        return keys;
      });

      if (objectKeys.length === 0) return true;
      try {
        await deleteObjects(objectKeys);
        assetRepository.completeDeleteJobs(objectKeys);
      } catch (error) {
        const message = error instanceof Error ? error.message : "OSS delete failed";
        assetRepository.failDeleteJobs(objectKeys, message, currentTime);
      }
      return true;
    },
  };
}

export type ArticleService = ReturnType<typeof createArticleService>;

export function isTiptapDocument(value: unknown): value is TiptapDocument {
  return Boolean(value && typeof value === "object" && (value as { type?: unknown }).type === "doc");
}
