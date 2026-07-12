import type { Metadata } from "next";

import { NewArticleEntry } from "@/components/editor/new-article-entry";

export const metadata: Metadata = { title: "新建文章" };

export default function NewPostPage() {
  return <NewArticleEntry />;
}
