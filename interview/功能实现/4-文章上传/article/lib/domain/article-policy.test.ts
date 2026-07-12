import { describe, expect, it } from "vitest";

import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";
import {
  normalizeArticleDraft,
  validateArticleForPublish,
} from "@/lib/domain/article-policy";

describe("normalizeArticleDraft", () => {
  it("allows an empty draft and normalizes tags immutably", () => {
    const input = {
      title: "  ",
      summary: "  ",
      tags: [" React ", "react", "Next.js"],
      content: EMPTY_TIPTAP_DOCUMENT,
      coverAssetId: null,
    };

    expect(normalizeArticleDraft(input)).toMatchObject({
      title: "",
      summary: "",
      tags: ["React", "Next.js"],
    });
    expect(input.tags).toEqual([" React ", "react", "Next.js"]);
  });

  it("rejects title, summary, and tag limits", () => {
    expect(() =>
      normalizeArticleDraft({
        title: "x".repeat(121),
        summary: "x".repeat(301),
        tags: Array.from({ length: 6 }, (_, index) => `tag-${index}`),
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).toThrow();
  });

  it("rejects a single overlong tag after trimming", () => {
    expect(() =>
      normalizeArticleDraft({
        title: "Draft",
        summary: "",
        tags: ["x".repeat(21)],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).toThrowError(expect.objectContaining({ code: "TAG_TOO_LONG" }));
  });

  it("rejects more than five distinct normalized tags", () => {
    expect(() =>
      normalizeArticleDraft({
        title: "Draft",
        summary: "",
        tags: ["one", "two", "three", "four", "five", "six"],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).toThrowError(expect.objectContaining({ code: "TAG_LIMIT_EXCEEDED" }));
  });
});

describe("validateArticleForPublish", () => {
  it("requires both a title and meaningful body text", () => {
    expect(() =>
      validateArticleForPublish({
        title: "",
        summary: "",
        tags: [],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).toThrow();
  });

  it("requires meaningful body text after a title is provided", () => {
    expect(() =>
      validateArticleForPublish({
        title: "A title",
        summary: "",
        tags: [],
        content: EMPTY_TIPTAP_DOCUMENT,
        coverAssetId: null,
      }),
    ).toThrowError(expect.objectContaining({ code: "CONTENT_REQUIRED" }));
  });

  it("accepts a complete article", () => {
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Useful body" }] },
      ],
    } as const;

    expect(
      validateArticleForPublish({
        title: "A useful post",
        summary: "Short summary",
        tags: ["Next.js"],
        content,
        coverAssetId: null,
      }),
    ).toMatchObject({ title: "A useful post" });
  });
});
