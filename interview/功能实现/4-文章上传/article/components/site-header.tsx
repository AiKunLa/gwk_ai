import Link from "next/link";
import { PenLine } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="字里首页">
          <span className="brand-mark" aria-hidden="true">字</span>
          <span>字里</span>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          <Link href="/">文章</Link>
          <Link href="/?status=draft">草稿</Link>
          <Link href="/posts/new" className="primary-button compact-button">
            <PenLine aria-hidden="true" />
            <span>写文章</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
