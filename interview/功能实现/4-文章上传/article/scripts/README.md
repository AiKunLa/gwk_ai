# 运维脚本

本目录保存清理等可重复执行的运维脚本。脚本必须明确输入、幂等性、日志和失败退出码。

`cleanup-assets.ts` 用于处理过期上传、孤儿资源和持久化删除任务。执行前确认 `ARTICLE_DB_PATH`、OSS 权限和备份状态。

运行：`pnpm cleanup:assets`。
