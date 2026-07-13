# Services 模块

服务层负责文章、上传和资源清理流程的编排，不负责页面状态或底层 SDK 细节。

- Article service：文章和 revision
- Upload service：策略、完成校验和资源关联
- Asset cleanup service：孤儿资源、删除任务和重试

每次改动都要检查事务边界、失败补偿和集成测试。
