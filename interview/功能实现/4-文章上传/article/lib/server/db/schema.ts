import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const articleDemoArticles = pgTable(
  "article_demo_articles",
  {
    id: uuid("id").primaryKey(),
    title: text("title").notNull().default(""),
    summary: text("summary").notNull().default(""),
    contentJson: jsonb("content_json").notNull(),
    contentText: text("content_text").notNull().default(""),
    tagsJson: jsonb("tags_json").notNull().default(sql`'[]'::jsonb`),
    status: text("status").notNull().default("draft"),
    revision: integer("revision").notNull().default(1),
    coverAssetId: uuid("cover_asset_id"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    publishedAt: bigint("published_at", { mode: "number" }),
  },
  (table) => [
    check("article_demo_articles_status_check", sql`${table.status} in ('draft', 'published')`),
    index("article_demo_articles_status_updated_idx").on(table.status, table.updatedAt),
  ],
);

export const articleDemoAssets = pgTable(
  "article_demo_assets",
  {
    id: uuid("id").primaryKey(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articleDemoArticles.id, { onDelete: "cascade" }),
    objectKey: text("object_key").notNull(),
    publicUrl: text("public_url").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    uploadExpiresAt: bigint("upload_expires_at", { mode: "number" }).notNull(),
    readyAt: bigint("ready_at", { mode: "number" }),
    orphanedAt: bigint("orphaned_at", { mode: "number" }),
    lastDeleteError: text("last_delete_error"),
  },
  (table) => [
    check("article_demo_assets_size_bytes_check", sql`${table.sizeBytes} > 0`),
    check("article_demo_assets_status_check", sql`${table.status} in ('pending', 'ready', 'delete_pending')`),
    uniqueIndex("article_demo_assets_object_key_idx").on(table.objectKey),
    index("article_demo_assets_article_status_idx").on(table.articleId, table.status),
    index("article_demo_assets_cleanup_idx").on(table.status, table.orphanedAt, table.uploadExpiresAt),
  ],
);

export const articleDemoAssetRefs = pgTable(
  "article_demo_asset_refs",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articleDemoArticles.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => articleDemoAssets.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.assetId, table.role] }),
    check("article_demo_asset_refs_role_check", sql`${table.role} in ('body', 'cover')`),
    check("article_demo_asset_refs_position_check", sql`${table.position} >= 0`),
  ],
);

export const articleDemoDeleteJobs = pgTable(
  "article_demo_delete_jobs",
  {
    id: uuid("id").primaryKey(),
    assetId: uuid("asset_id").references(() => articleDemoAssets.id, { onDelete: "set null" }),
    objectKey: text("object_key").notNull(),
    notBefore: bigint("not_before", { mode: "number" }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: bigint("next_attempt_at", { mode: "number" }).notNull(),
    lastError: text("last_error"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("article_demo_delete_jobs_object_key_idx").on(table.objectKey),
    index("article_demo_delete_jobs_due_idx").on(table.nextAttemptAt, table.notBefore),
  ],
);
