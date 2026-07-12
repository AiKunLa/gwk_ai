import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ChevronLeft, Edit3 } from "lucide-react";

import { ArticleBody } from "@/components/article-body";
import { getRuntime } from "@/lib/server/runtime";

export const metadata: Metadata = { title: "文章预览" };
export const runtime = "nodejs";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const article = getRuntime().articleService.get(id);
  if (!article) notFound();

  return (
    <main className="article-page preview-page">
      <div className="preview-bar">
        <Link href={`/posts/${id}/edit`}><ChevronLeft />返回编辑</Link>
        <span>预览</span>
        <Link href={`/posts/${id}/edit`} className="secondary-button compact-button"><Edit3 />继续编辑</Link>
      </div>
      <article>
        <header className="article-header">
          <h1>{article.title || "未命名文章"}</h1>
          {article.summary && <p className="article-deck">{article.summary}</p>}
          <div className="tag-list">{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        </header>
        <ArticleBody content={article.content} />
      </article>
    </main>
  );
}
