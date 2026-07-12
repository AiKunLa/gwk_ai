import type { DatabaseSync } from "node:sqlite";

import {
  EMPTY_TIPTAP_DOCUMENT,
  type TiptapDocument,
} from "@/lib/domain/article-content";
import { DomainError } from "@/lib/domain/errors";

export type ArticleStatus = "draft" | "published";

export interface ArticleRecord {
  id: string;
  title: string;
  summary: string;
  content: TiptapDocument;
  contentText: string;
  tags: string[];
  status: ArticleStatus;
  revision: number;
  coverAssetId: string | null;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
}

interface ArticleRow {
  id: string;
  title: string;
  summary: string;
  content_json: string;
  content_text: string;
  tags_json: string;
  status: ArticleStatus;
  revision: number;
  cover_asset_id: string | null;
  created_at: number;
  updated_at: number;
  published_at: number | null;
}

export interface ArticleUpdate {
  id: string;
  expectedRevision: number;
  title: string;
  summary: string;
  content: TiptapDocument;
  contentText: string;
  tags: readonly string[];
  status: ArticleStatus;
  coverAssetId: string | null;
  publishedAt: number | null;
  now: number;
}

export function createArticleRepository(database: DatabaseSync) {
  const findStatement = database.prepare("SELECT * FROM articles WHERE id = ?");
  const insertStatement = database.prepare(`
    INSERT INTO articles (
      id, content_json, tags_json, created_at, updated_at
    ) VALUES (?, ?, '[]', ?, ?)
  `);
  const updateStatement = database.prepare(`
    UPDATE articles
    SET title = ?, summary = ?, content_json = ?, content_text = ?, tags_json = ?,
        status = ?, cover_asset_id = ?, published_at = ?, updated_at = ?,
        revision = revision + 1
    WHERE id = ? AND revision = ?
  `);
  const deleteStatement = database.prepare("DELETE FROM articles WHERE id = ?");

  function findById(id: string): ArticleRecord | null {
    const row = findStatement.get(id) as unknown as ArticleRow | undefined;
    return row ? mapArticleRow(row) : null;
  }

  return {
    createDraft(input: { id: string; now: number }): ArticleRecord {
      insertStatement.run(
        input.id,
        JSON.stringify(EMPTY_TIPTAP_DOCUMENT),
        input.now,
        input.now,
      );
      return requireArticle(findById(input.id));
    },

    findById,

    update(input: ArticleUpdate): ArticleRecord {
      const result = updateStatement.run(
        input.title,
        input.summary,
        JSON.stringify(input.content),
        input.contentText,
        JSON.stringify([...input.tags]),
        input.status,
        input.coverAssetId,
        input.publishedAt,
        input.now,
        input.id,
        input.expectedRevision,
      );

      if (Number(result.changes) === 0) {
        if (!findById(input.id)) {
          throw new DomainError("文章不存在", "ARTICLE_NOT_FOUND");
        }
        throw new DomainError("文章已在其他页面更新", "REVISION_CONFLICT");
      }

      return requireArticle(findById(input.id));
    },

    list(input: { status: ArticleStatus; limit: number; offset?: number }): {
      items: ArticleRecord[];
      total: number;
    } {
      const limit = Math.min(Math.max(Math.trunc(input.limit), 1), 100);
      const offset = Math.max(Math.trunc(input.offset ?? 0), 0);
      const rows = database
        .prepare(
          "SELECT * FROM articles WHERE status = ? ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?",
        )
        .all(input.status, limit, offset) as unknown as ArticleRow[];
      const countRow = database
        .prepare("SELECT COUNT(*) AS total FROM articles WHERE status = ?")
        .get(input.status) as unknown as { total: number };

      return {
        items: rows.map(mapArticleRow),
        total: Number(countRow.total),
      };
    },

    delete(id: string): boolean {
      return Number(deleteStatement.run(id).changes) > 0;
    },
  };
}

function requireArticle(article: ArticleRecord | null): ArticleRecord {
  if (!article) {
    throw new DomainError("文章不存在", "ARTICLE_NOT_FOUND");
  }
  return article;
}

function mapArticleRow(row: ArticleRow): ArticleRecord {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: JSON.parse(row.content_json) as TiptapDocument,
    contentText: row.content_text,
    tags: JSON.parse(row.tags_json) as string[],
    status: row.status,
    revision: Number(row.revision),
    coverAssetId: row.cover_asset_id,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    publishedAt: row.published_at === null ? null : Number(row.published_at),
  };
}
