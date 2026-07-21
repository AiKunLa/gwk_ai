# SQLite 运行参考

数据库文件由 `ARTICLE_DB_PATH` 指定，使用 Node.js 内置 `node:sqlite`。当前项目没有独立数据库服务或迁移框架。

备份时复制完整数据库文件，恢复前停止应用并确认代码版本兼容。schema 变更必须先在测试数据库验证，并在[数据库与迁移](../7-DEVELOPMENT/database-and-migrations.md)记录。
