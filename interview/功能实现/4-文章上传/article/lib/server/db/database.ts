import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export function createDatabase(filename: string): DatabaseSync {
  if (filename !== ":memory:") {
    mkdirSync(dirname(resolve(filename)), { recursive: true });
  }

  const database = new DatabaseSync(filename);
  database.exec("PRAGMA foreign_keys = ON");
  database.exec("PRAGMA busy_timeout = 5000");

  if (filename !== ":memory:") {
    database.exec("PRAGMA journal_mode = WAL");
  }

  return database;
}

export function migrateDatabase(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      content_json TEXT NOT NULL,
      content_text TEXT NOT NULL DEFAULT '',
      tags_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      revision INTEGER NOT NULL DEFAULT 1,
      cover_asset_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      published_at INTEGER
    ) STRICT;

    CREATE INDEX IF NOT EXISTS articles_status_updated_idx
      ON articles (status, updated_at DESC);

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      object_key TEXT NOT NULL UNIQUE,
      public_url TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'ready', 'delete_pending')),
      created_at INTEGER NOT NULL,
      upload_expires_at INTEGER NOT NULL,
      ready_at INTEGER,
      orphaned_at INTEGER,
      last_delete_error TEXT
    ) STRICT;

    CREATE INDEX IF NOT EXISTS assets_article_status_idx
      ON assets (article_id, status);
    CREATE INDEX IF NOT EXISTS assets_cleanup_idx
      ON assets (status, orphaned_at, upload_expires_at);

    CREATE TABLE IF NOT EXISTS article_assets (
      article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('body', 'cover')),
      position INTEGER NOT NULL CHECK (position >= 0),
      PRIMARY KEY (article_id, asset_id, role)
    ) STRICT;

    CREATE UNIQUE INDEX IF NOT EXISTS article_single_cover_idx
      ON article_assets (article_id)
      WHERE role = 'cover';

    CREATE TABLE IF NOT EXISTS asset_delete_jobs (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      object_key TEXT NOT NULL UNIQUE,
      not_before INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at INTEGER NOT NULL,
      last_error TEXT,
      created_at INTEGER NOT NULL
    ) STRICT;

    CREATE INDEX IF NOT EXISTS asset_delete_jobs_due_idx
      ON asset_delete_jobs (next_attempt_at, not_before);
  `);
}

export function runInTransaction<T>(database: DatabaseSync, work: () => T): T {
  if (database.isTransaction) return work();

  database.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
