# 升级与备份

## 升级前

1. 停止写入或切换到维护窗口。
2. 备份 `ARTICLE_DB_PATH` 指向的 SQLite 文件。
3. 记录当前应用版本和环境变量。
4. 确认 OSS Bucket 权限、CORS 和版本控制状态。

## 升级

```powershell
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

当前项目没有独立迁移框架。任何 schema 变更必须先在测试数据库验证，并在[数据库与迁移](../7-DEVELOPMENT/database-and-migrations.md)记录兼容策略。

## 回滚与验证

保留旧依赖锁文件、旧构建产物和数据库备份。启动后验证首页、文章列表、草稿保存、图片上传和资源清理；异常时停止新进程并恢复兼容的 SQLite 备份。
