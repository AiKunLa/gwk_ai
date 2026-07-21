import type { JSONContent } from "@tiptap/core";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import sanitizeHtml from "sanitize-html";

import type { TiptapDocument } from "@/lib/domain/article-content";
import { createArticleExtensions } from "@/lib/rich-text/extensions";

export function renderArticleHtml(document: TiptapDocument): string {
  const rendered = renderToHTMLString({
    extensions: createArticleExtensions(),
    content: document as JSONContent,
  });

  return sanitizeHtml(rendered, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "strong",
      "em",
      "s",
      "u",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "hr",
      "br",
      "a",
      "figure",
      "img",
      "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      figure: ["data-type", "data-align", "data-size"],
      img: ["src", "alt", "data-asset-id", "loading", "decoding"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  });
}
