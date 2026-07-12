import { beforeEach, describe, expect, it, vi } from "vitest";

import PostPage, { generateMetadata } from "@/app/posts/[id]/page";
import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";
import type { ArticleView } from "@/lib/server/services/article-service";

const pageHarness = vi.hoisted(() => ({
  connection: vi.fn(async () => undefined),
  getArticle: vi.fn(),
  notFound: vi.fn((): never => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/server", () => ({ connection: pageHarness.connection }));
vi.mock("next/navigation", () => ({ notFound: pageHarness.notFound }));
vi.mock("@/lib/server/runtime", () => ({
  getRuntime: () => ({ articleService: { get: pageHarness.getArticle } }),
}));

describe("published post page", () => {
  beforeEach(() => {
    pageHarness.connection.mockClear();
    pageHarness.getArticle.mockReset();
    pageHarness.notFound.mockClear();
  });

  it("returns not found metadata for a draft", async () => {
    pageHarness.getArticle.mockReturnValue(createArticle({ status: "draft" }));

    await expect(
      generateMetadata({ params: Promise.resolve({ id: "post-id" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(pageHarness.notFound).toHaveBeenCalledTimes(1);
  });

  it("does not render a draft at its public URL", async () => {
    pageHarness.getArticle.mockReturnValue(createArticle({ status: "draft" }));

    await expect(
      PostPage({ params: Promise.resolve({ id: "post-id" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(pageHarness.notFound).toHaveBeenCalledTimes(1);
  });

  it("keeps published metadata available", async () => {
    const article = createArticle({ status: "published" });
    pageHarness.getArticle.mockReturnValue(article);

    await expect(
      generateMetadata({ params: Promise.resolve({ id: article.id }) }),
    ).resolves.toMatchObject({ title: article.title, description: article.summary });
  });
});

function createArticle(overrides: Partial<ArticleView> = {}): ArticleView {
  return {
    id: "post-id",
    title: "Private draft title",
    summary: "Private draft summary",
    content: EMPTY_TIPTAP_DOCUMENT,
    contentText: "",
    tags: [],
    status: "draft",
    revision: 0,
    coverAssetId: null,
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
    publishedAt: null,
    effectiveCoverAssetId: null,
    effectiveCoverUrl: null,
    ...overrides,
  };
}
