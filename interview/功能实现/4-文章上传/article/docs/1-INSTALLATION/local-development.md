# 本地开发环境

## 安装与启动

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

开发服务器绑定 `127.0.0.1`，默认访问 `http://127.0.0.1:3000`。

## 常用验证

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
```

## 数据目录

SQLite 路径由 `ARTICLE_DB_PATH` 决定。开发时不要把真实数据目录提交到 Git，升级或切换分支前先备份数据库文件。
