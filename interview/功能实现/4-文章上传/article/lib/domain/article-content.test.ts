import { describe, expect, it } from "vitest";

import {
  canonicalizeArticleImages,
  EMPTY_TIPTAP_DOCUMENT,
  extractImageAssetIds,
  extractPlainText,
  resolveCoverAssetId,
  validateTiptapDocument,
} from "@/lib/domain/article-content";

const documentWithImages = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "A practical heading" }],
    },
    {
      type: "articleImage",
      attrs: { assetId: "asset-first", src: "https://example.test/1.png" },
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Body copy" }],
    },
    {
      type: "articleImage",
      attrs: { assetId: "asset-first", src: "https://example.test/1.png" },
    },
    {
      type: "articleImage",
      attrs: { assetId: "asset-second", src: "https://example.test/2.png" },
    },
  ],
} as const;

describe("article content helpers", () => {
  it("extracts unique image assets in document order without mutation", () => {
    const before = structuredClone(documentWithImages);

    expect(extractImageAssetIds(documentWithImages)).toEqual([
      "asset-first",
      "asset-second",
    ]);
    expect(documentWithImages).toEqual(before);
  });

  it("uses an explicit cover before falling back to the first body image", () => {
    expect(resolveCoverAssetId("asset-cover", documentWithImages)).toBe(
      "asset-cover",
    );
    expect(resolveCoverAssetId(null, documentWithImages)).toBe("asset-first");
    expect(resolveCoverAssetId(null, EMPTY_TIPTAP_DOCUMENT)).toBeNull();
  });

  it("extracts readable text without image metadata", () => {
    expect(extractPlainText(documentWithImages)).toBe(
      "A practical heading\nBody copy",
    );
  });

  it.each([
    {
      input: {
        type: "doc",
        toJSON: () => {
          throw new Error("cannot serialize");
        },
      },
      message: "正文格式不合法",
    },
    {
      input: { type: "paragraph" },
      message: "正文必须是 Tiptap 文档",
    },
    {
      input: { type: "doc", content: { type: "paragraph" } },
      message: "正文子节点不合法",
    },
    {
      input: { type: "doc", content: [{ type: "text" }] },
      message: "文本节点不合法",
    },
    {
      input: { type: "doc", content: [null] },
      message: "正文节点不合法",
    },
  ])("rejects malformed content: $message", ({ input, message }) => {
    expect(() => validateTiptapDocument(input)).toThrowError(message);
  });

  it("canonicalizes image URLs and attributes without mutating content", () => {
    const document = {
      type: "doc",
      attrs: { locale: "zh-CN" },
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Body",
              marks: [{ type: "bold", attrs: { source: "editor" } }],
            },
          ],
        },
        {
          type: "articleImage",
          attrs: {
            assetId: "asset-first",
            src: "https://untrusted.example/image.png",
            alt: "  Diagram  ",
            caption: 42,
            align: "unsupported",
            size: "small",
          },
        },
      ],
    } as const;
    const before = structuredClone(document);

    const canonical = canonicalizeArticleImages(
      document,
      new Map([["asset-first", "https://cdn.example.test/asset-first.png"]]),
    );

    expect(canonical.content?.[1]).toEqual({
      type: "articleImage",
      attrs: {
        assetId: "asset-first",
        src: "https://cdn.example.test/asset-first.png",
        alt: "Diagram",
        caption: "",
        align: "center",
        size: "small",
      },
    });
    expect(canonical.content?.[0]).not.toBe(document.content[0]);
    expect(document).toEqual(before);
  });

  it("accepts the marks registered by the shared Tiptap StarterKit", () => {
    const document = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Marked text",
              marks: [
                { type: "bold" },
                { type: "italic" },
                { type: "strike" },
                { type: "code" },
                { type: "link", attrs: { href: "https://example.test" } },
                { type: "underline" },
              ],
            },
          ],
        },
      ],
    } as const;

    expect(validateTiptapDocument(document)).toEqual(document);
  });

  it.each([
    { marks: { type: "bold" }, label: "a non-array mark collection" },
    { marks: [{ type: "notARealMark" }], label: "an unknown mark type" },
    { marks: [null], label: "a malformed mark" },
  ])("rejects $label", ({ marks }) => {
    const document = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Body", marks }],
        },
      ],
    };

    expect(() => validateTiptapDocument(document)).toThrowError("正文标记不合法");
  });

  it("rejects image nodes without a ready owned asset", () => {
    const missingAssetId = {
      type: "doc",
      content: [{ type: "articleImage", attrs: {} }],
    } as const;
    const unavailableAsset = {
      type: "doc",
      content: [{ type: "articleImage", attrs: { assetId: "asset-missing" } }],
    } as const;

    expect(() => canonicalizeArticleImages(missingAssetId, new Map())).toThrowError(
      "图片节点缺少资产编号",
    );
    expect(() => canonicalizeArticleImages(unavailableAsset, new Map())).toThrowError(
      "正文引用了不可用的图片",
    );
  });
});
