# 页面空白或 500

## 症状

首页、文章详情或 API 返回空白、500 或构建错误。

## 检查

查看终端错误、浏览器 Network、`pnpm typecheck` 和 `pnpm build` 输出，确认 SQLite 路径可写。

## 修复与验证

修正具体异常后重启服务，先验证首页，再验证 `GET /api/articles` 和文章详情页。
