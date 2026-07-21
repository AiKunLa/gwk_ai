import { parseImageUploadIntent } from "@/lib/domain/image-policy";
import { DomainError } from "@/lib/domain/errors";
import type { createArticleRepository } from "@/lib/server/db/article-repository";
import type { createAssetRepository } from "@/lib/server/db/asset-repository";
import type { ObjectStorage } from "@/lib/server/storage/object-storage";
import { verifyUploadedImage } from "@/lib/server/storage/upload-verification";

type ArticleRepository = ReturnType<typeof createArticleRepository>;
type AssetRepository = ReturnType<typeof createAssetRepository>;

export function createUploadService(dependencies: {
  articleRepository: ArticleRepository;
  assetRepository: AssetRepository;
  storage: ObjectStorage;
  createId: () => string;
  now: () => number;
  cleanup?: () => Promise<unknown>;
}) {
  const { articleRepository, assetRepository, storage, createId, now, cleanup } = dependencies;

  return {
    async createIntent(input: {
      articleId: string;
      fileName: string;
      contentType: string;
      sizeBytes: number;
    }) {
      if (cleanup) await cleanup();
      if (!articleRepository.findById(input.articleId)) {
        throw new DomainError("文章不存在", "ARTICLE_NOT_FOUND");
      }

      const image = parseImageUploadIntent({
        fileName: input.fileName,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes,
      });
      const assetId = createId();
      const objectKey = `posts/${input.articleId}/${assetId}.${image.extension}`;
      const currentTime = now();
      const upload = await storage.createUpload({
        objectKey,
        contentType: image.contentType,
        now: new Date(currentTime),
      });
      const asset = assetRepository.createPending({
        id: assetId,
        articleId: input.articleId,
        objectKey,
        publicUrl: upload.publicUrl,
        originalName: image.originalName,
        mimeType: image.contentType,
        sizeBytes: image.sizeBytes,
        uploadExpiresAt: Date.parse(upload.expiresAt),
        now: currentTime,
      });

      return { asset, upload };
    },

    async complete(assetId: string) {
      const asset = assetRepository.findById(assetId);
      if (!asset) {
        throw new DomainError("图片不存在", "ASSET_NOT_FOUND");
      }
      if (asset.status === "ready") return asset;
      if (asset.status !== "pending") {
        throw new DomainError("图片状态不允许完成上传", "INVALID_ASSET_STATE");
      }

      const inspection = await storage.inspectObject(asset.objectKey);
      await verifyUploadedImage({
        expectedMimeType: asset.mimeType,
        expectedSizeBytes: asset.sizeBytes,
        actualMimeType: inspection.contentType,
        actualSizeBytes: inspection.sizeBytes,
        prefix: inspection.prefix,
      });
      await storage.publishObject(asset.objectKey);
      return assetRepository.markReady(assetId, now());
    },
  };
}

export type UploadService = ReturnType<typeof createUploadService>;
