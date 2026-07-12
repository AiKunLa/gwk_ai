import { z } from "zod";

import {
  extractPlainText,
  type TiptapDocument,
  validateTiptapDocument,
} from "@/lib/domain/article-content";
import { DomainError } from "@/lib/domain/errors";

export const MAX_TITLE_LENGTH = 120;
export const MAX_SUMMARY_LENGTH = 300;
export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 20;

const articleDraftSchema = z
  .object({
    title: z.string().max(MAX_TITLE_LENGTH),
    summary: z.string().max(MAX_SUMMARY_LENGTH),
    tags: z.array(z.string().max(MAX_TAG_LENGTH + 2)).max(20),
    content: z.unknown(),
    coverAssetId: z.string().uuid().nullable(),
  })
  .strict();

export interface ArticleDraftInput {
  title: string;
  summary: string;
  tags: readonly string[];
  content: unknown;
  coverAssetId: string | null;
}

export interface NormalizedArticleDraft {
  title: string;
  summary: string;
  tags: string[];
  content: TiptapDocument;
  coverAssetId: string | null;
}

export function normalizeArticleDraft(
  input: ArticleDraftInput,
): NormalizedArticleDraft {
  const parsed = articleDraftSchema.parse(input);
  const title = parsed.title.trim();
  const summary = parsed.summary.trim();
  const tags = normalizeTags(parsed.tags);

  return {
    title,
    summary,
    tags,
    content: validateTiptapDocument(parsed.content),
    coverAssetId: parsed.coverAssetId,
  };
}

export function validateArticleForPublish(
  input: ArticleDraftInput,
): NormalizedArticleDraft {
  const article = normalizeArticleDraft(input);

  if (!article.title) {
    throw new DomainError("发布前请填写标题", "TITLE_REQUIRED");
  }

  if (!extractPlainText(article.content)) {
    throw new DomainError("发布前请填写正文", "CONTENT_REQUIRED");
  }

  return article;
}

function normalizeTags(inputTags: readonly string[]): string[] {
  const normalizedTags: string[] = [];
  const normalizedKeys = new Set<string>();

  for (const inputTag of inputTags) {
    const tag = inputTag.trim();
    if (!tag) continue;
    if (tag.length > MAX_TAG_LENGTH) {
      throw new DomainError("标签过长", "TAG_TOO_LONG");
    }

    const key = tag.toLocaleLowerCase();
    if (normalizedKeys.has(key)) continue;
    normalizedKeys.add(key);
    normalizedTags.push(tag);
  }

  if (normalizedTags.length > MAX_TAGS) {
    throw new DomainError(`最多添加 ${MAX_TAGS} 个标签`, "TAG_LIMIT_EXCEEDED");
  }

  return normalizedTags;
}
