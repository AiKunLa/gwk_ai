import { StarterKit } from "@tiptap/starter-kit";

import { ArticleImage } from "@/lib/rich-text/article-image";

export function createArticleExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      },
    }),
    ArticleImage,
  ];
}
