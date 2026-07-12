import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { ArticleComposer } from "@/components/editor/article-composer";
import { getRuntime } from "@/lib/server/runtime";

export const metadata: Metadata = { title: "编辑文章" };
export const runtime = "nodejs";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const article = getRuntime().articleService.get(id);
  if (!article) notFound();
  return <ArticleComposer article={article} />;
}
