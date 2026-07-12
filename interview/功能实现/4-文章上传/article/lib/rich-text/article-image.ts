import { mergeAttributes } from "@tiptap/core";
import { Image } from "@tiptap/extension-image";

export const ArticleImage = Image.extend({
  name: "articleImage",

  addAttributes() {
    return {
      assetId: { default: null },
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      align: { default: "center" },
      size: { default: "wide" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="article-image"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const image = element.querySelector("img");
          if (!image) return false;
          return {
            assetId: image.getAttribute("data-asset-id"),
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt") ?? "",
            caption: element.querySelector("figcaption")?.textContent ?? "",
            align: element.getAttribute("data-align") ?? "center",
            size: element.getAttribute("data-size") ?? "wide",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const caption = typeof HTMLAttributes.caption === "string"
      ? HTMLAttributes.caption
      : "";
    const figureAttributes = {
      "data-type": "article-image",
      "data-align": HTMLAttributes.align ?? "center",
      "data-size": HTMLAttributes.size ?? "wide",
    };
    const imageAttributes = mergeAttributes({
      src: HTMLAttributes.src,
      alt: HTMLAttributes.alt ?? "",
      "data-asset-id": HTMLAttributes.assetId,
      loading: "lazy",
      decoding: "async",
    });

    return [
      "figure",
      figureAttributes,
      ["img", imageAttributes],
      ...(caption ? [["figcaption", {}, caption]] : []),
    ];
  },
});
