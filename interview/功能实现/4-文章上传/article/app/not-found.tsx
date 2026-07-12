import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="center-state">
      <div className="state-message">
        <FileQuestion />
        <h1>文章不存在</h1>
        <Link href="/" className="secondary-button"><ArrowLeft />返回文章列表</Link>
      </div>
    </main>
  );
}
