// @vitest-environment node

import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";
import { DomainError } from "@/lib/domain/errors";
import { createArticleRepository } from "@/lib/server/db/article-repository";
import { createDatabase, migrateDatabase } from "@/lib/server/db/database";

describe("article repository", () => {
  let database: DatabaseSync;

  beforeEach(() => {
    database = createDatabase(":memory:");
    migrateDatabase(database);
  });

  afterEach(() => {
    database.close();
  });

  it("creates and reads an empty draft", () => {
    const repository = createArticleRepository(database);

    const draft = repository.createDraft({
      id: "article-1",
      now: 1_700_000_000_000,
    });

    expect(draft).toMatchObject({
      id: "article-1",
      title: "",
      summary: "",
      tags: [],
      content: EMPTY_TIPTAP_DOCUMENT,
      status: "draft",
      revision: 1,
      coverAssetId: null,
      publishedAt: null,
    });
    expect(repository.findById("article-1")).toEqual(draft);
  });

  it("updates with optimistic locking and preserves Tiptap JSON", () => {
    const repository = createArticleRepository(database);
    repository.createDraft({ id: "article-1", now: 100 });
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Saved body" }] },
      ],
    } as const;

    const updated = repository.update({
      id: "article-1",
      expectedRevision: 1,
      title: "Saved title",
      summary: "Summary",
      tags: ["Next.js", "Tiptap"],
      content,
      contentText: "Saved body",
      status: "draft",
      coverAssetId: null,
      publishedAt: null,
      now: 200,
    });

    expect(updated).toMatchObject({
      revision: 2,
      title: "Saved title",
      tags: ["Next.js", "Tiptap"],
      content,
      updatedAt: 200,
    });

    expect(() =>
      repository.update({
        id: "article-1",
        expectedRevision: 1,
        title: "Stale title",
        summary: "",
        tags: [],
        content: EMPTY_TIPTAP_DOCUMENT,
        contentText: "",
        status: "draft",
        coverAssetId: null,
        publishedAt: null,
        now: 300,
      }),
    ).toThrowError(expect.objectContaining<Partial<DomainError>>({ code: "REVISION_CONFLICT" }));
  });

  it("filters published articles and orders the latest update first", () => {
    const repository = createArticleRepository(database);
    repository.createDraft({ id: "draft", now: 100 });
    repository.createDraft({ id: "published-old", now: 110 });
    repository.createDraft({ id: "published-new", now: 120 });

    for (const [id, now] of [
      ["published-old", 200],
      ["published-new", 300],
    ] as const) {
      repository.update({
        id,
        expectedRevision: 1,
        title: id,
        summary: "",
        tags: [],
        content: {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: id }] }],
        },
        contentText: id,
        status: "published",
        coverAssetId: null,
        publishedAt: now,
        now,
      });
    }

    expect(repository.list({ status: "published", limit: 20 })).toMatchObject({
      total: 2,
      items: [{ id: "published-new" }, { id: "published-old" }],
    });
    expect(repository.list({ status: "draft", limit: 20 }).items).toHaveLength(1);
  });

  it("deletes an article", () => {
    const repository = createArticleRepository(database);
    repository.createDraft({ id: "article-1", now: 100 });

    expect(repository.delete("article-1")).toBe(true);
    expect(repository.findById("article-1")).toBeNull();
    expect(repository.delete("article-1")).toBe(false);
  });
});
