import { z } from "zod";

import { DomainError } from "@/lib/domain/errors";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_ARTICLE_IMAGES = 20;

const extensionByMimeType = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
} as const;

export type AllowedImageMimeType = keyof typeof extensionByMimeType;
export type NormalizedImageExtension = "jpg" | "png" | "webp" | "gif";

const imageUploadIntentSchema = z
  .object({
    fileName: z.string().min(1).max(255),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
    sizeBytes: z.number().int().min(1).max(MAX_IMAGE_SIZE_BYTES),
  })
  .strict();

export interface ImageUploadIntent {
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface ParsedImageUploadIntent {
  originalName: string;
  contentType: AllowedImageMimeType;
  extension: NormalizedImageExtension;
  sizeBytes: number;
}

export function parseImageUploadIntent(
  input: ImageUploadIntent,
): ParsedImageUploadIntent {
  const parsed = imageUploadIntentSchema.parse(input);

  if (parsed.fileName.includes("/") || parsed.fileName.includes("\\")) {
    throw new DomainError("文件名不合法", "INVALID_FILE_NAME");
  }

  const rawExtension = parsed.fileName.split(".").at(-1)?.toLowerCase();
  const allowedExtensions = extensionByMimeType[parsed.contentType];

  if (!rawExtension || !allowedExtensions.some((value) => value === rawExtension)) {
    throw new DomainError("图片扩展名与类型不匹配", "IMAGE_TYPE_MISMATCH");
  }

  const extension = (rawExtension === "jpeg"
    ? "jpg"
    : rawExtension) as NormalizedImageExtension;

  return {
    originalName: parsed.fileName,
    contentType: parsed.contentType,
    extension,
    sizeBytes: parsed.sizeBytes,
  };
}

export function assertImageCountWithinLimit(
  bodyAssetIds: readonly string[],
  coverAssetId: string | null,
): void {
  const uniqueAssetIds = new Set(bodyAssetIds);
  if (coverAssetId) {
    uniqueAssetIds.add(coverAssetId);
  }

  if (uniqueAssetIds.size > MAX_ARTICLE_IMAGES) {
    throw new DomainError(
      `每篇文章最多使用 ${MAX_ARTICLE_IMAGES} 张图片`,
      "IMAGE_LIMIT_EXCEEDED",
    );
  }
}
