import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "字里 - 分享值得读的内容",
    template: "%s | 字里",
  },
  description: "支持富文本与图片上传的本地文章社区 Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
