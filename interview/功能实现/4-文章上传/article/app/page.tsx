import Link from "next/link";
import { connection } from "next/server";
import { FileText, PenLine } from "lucide-react";

import { ArticleCard } from "@/components/article-card";
import { getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  const query = await searchParams;
  const status = query.status === "draft" ? "draft" : "published";
  const result = getRuntime().articleService.list({ status, limit: 30, offset: 0 });

  return (
    <main className="feed-page">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">社区文章</p>
          <h1>{status === "published" ? "最新发布" : "草稿箱"}</h1>
        </div>
        <Link href="/posts/new" className="primary-button mobile-write-button">
          <PenLine />写文章
        </Link>
      </div>

      <div className="feed-tabs" role="navigation" aria-label="文章状态">
        <Link href="/" aria-current={status === "published" ? "page" : undefined}>已发布</Link>
        <Link href="/?status=draft" aria-current={status === "draft" ? "page" : undefined}>草稿</Link>
      </div>

      {result.items.length > 0 ? (
        <div className="article-list">
          {result.items.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      ) : (
        <div className="empty-state">
          <FileText aria-hidden="true" />
          <h2>{status === "published" ? "还没有已发布文章" : "草稿箱是空的"}</h2>
          <Link href="/posts/new" className="primary-button"><PenLine />写第一篇</Link>
        </div>
      )}
    </main>
  );
}
