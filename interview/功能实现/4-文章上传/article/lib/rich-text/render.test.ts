// @vitest-environment node

import { describe, expect, it } from "vitest";

import { renderArticleHtml } from "@/lib/rich-text/render";

describe("renderArticleHtml", () => {
  it("renders the supported article structure", () => {
    const html = renderArticleHtml({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Section title" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "Important" },
            { type: "text", text: " body" },
          ],
        },
        {
          type: "articleImage",
          attrs: {
            assetId: "asset-1",
            src: "https://cdn.example.test/image.png",
            alt: "Architecture diagram",
            caption: "Request lifecycle",
            align: "center",
            size: "medium",
          },
        },
      ],
    });

    expect(html).toContain("<h2>Section title</h2>");
    expect(html).toContain("<strong>Important</strong> body");
    expect(html).toContain('data-type="article-image"');
    expect(html).toContain('data-asset-id="asset-1"');
    expect(html).toContain("<figcaption>Request lifecycle</figcaption>");
  });

  it("removes unsafe link protocols and never renders raw script markup", () => {
    const html = renderArticleHtml({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Unsafe link",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
            { type: "text", text: "<script>alert(1)</script>" },
          ],
        },
      ],
    });

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });
});
