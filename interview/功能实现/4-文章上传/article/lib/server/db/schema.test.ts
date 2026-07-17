// @vitest-environment node

import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  articleDemoArticles,
  articleDemoAssets,
  articleDemoAssetRefs,
  articleDemoDeleteJobs,
} from "@/lib/server/db/schema";

describe("article demo PostgreSQL schema", () => {
  it("uses isolated table names in the shared database", () => {
    expect([
      getTableName(articleDemoArticles),
      getTableName(articleDemoAssets),
      getTableName(articleDemoAssetRefs),
      getTableName(articleDemoDeleteJobs),
    ]).toEqual([
      "article_demo_articles",
      "article_demo_assets",
      "article_demo_asset_refs",
      "article_demo_delete_jobs",
    ]);
  });
});
