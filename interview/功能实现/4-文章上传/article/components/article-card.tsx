import Link from "next/link";
import { BookOpen, Clock3, Edit3 } from "lucide-react";

import type { ArticleView } from "@/lib/server/services/article-service";

export function ArticleCard({ article }: { article: ArticleView }) {
  const detailHref = article.status === "published"
    ? `/posts/${article.id}`
    : `/posts/${article.id}/preview`;

  return (
    <article className="article-card" data-testid="article-card">
      <div className="article-card-body">
        <div className="article-meta-row">
          <span className={`status-badge status-${article.status}`}>
            {article.status === "published" ? "已发布" : "草稿"}
          </span>
          <span><Clock3 aria-hidden="true" />{formatDate(article.updatedAt)}</span>
        </div>
        <h2>
          <Link href={detailHref}>{article.title || "未命名文章"}</Link>
        </h2>
        <p>{article.summary || article.contentText.slice(0, 120) || "正文尚未填写"}</p>
        <div className="article-card-footer">
          <div className="tag-list" aria-label="文章标签">
            {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
          {article.status === "draft" && (
            <Link href={`/posts/${article.id}/edit`} className="text-action">
              <Edit3 aria-hidden="true" />编辑
            </Link>
          )}
        </div>
      </div>
      <Link className="article-cover" href={detailHref} tabIndex={-1} aria-hidden="true">
        {article.effectiveCoverUrl ? (
          // User-generated object-storage URLs are validated by the server.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.effectiveCoverUrl} alt="" />
        ) : (
          <span className="cover-placeholder"><BookOpen /></span>
        )}
      </Link>
    </article>
  );
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
