import type { TiptapDocument } from "@/lib/domain/article-content";
import { renderArticleHtml } from "@/lib/rich-text/render";

export function ArticleBody({ content }: { content: TiptapDocument }) {
  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: renderArticleHtml(content) }}
    />
  );
}
