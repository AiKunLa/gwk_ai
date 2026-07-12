import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Edit3 } from "lucide-react";

import { ArticleBody } from "@/components/article-body";
import { getRuntime } from "@/lib/server/runtime";

export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await connection();
  const { id } = await params;
  const article = getRuntime().articleService.get(id);
  if (!article || article.status !== "published") notFound();
  return { title: article.title, description: article.summary || undefined };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const article = getRuntime().articleService.get(id);
  if (!article || article.status !== "published") notFound();

  return (
    <main className="article-page">
      <article>
        <header className="article-header">
          <div className="article-kicker-row">
            <span className={`status-badge status-${article.status}`}>
              {article.status === "published" ? "已发布" : "草稿"}
            </span>
            <time dateTime={new Date(article.updatedAt).toISOString()}>
              {new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(new Date(article.updatedAt))}
            </time>
          </div>
          <h1>{article.title || "未命名文章"}</h1>
          {article.summary && <p className="article-deck">{article.summary}</p>}
          <div className="article-header-actions">
            <div className="tag-list">{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            <Link href={`/posts/${article.id}/edit`} className="secondary-button compact-button">
              <Edit3 />编辑
            </Link>
          </div>
        </header>
        <ArticleBody content={article.content} />
      </article>
    </main>
  );
}
