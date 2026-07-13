# 开发架构

请求路径通常是：页面或组件 → API route → HTTP handler → service → domain policy → repository/storage provider。

页面不应直接访问 SQLite 或 `ali-oss`。API 边界负责 Zod 输入校验、同源校验、限流和统一错误响应；服务层编排事务和外部副作用；领域层保持文章、内容和图片不变量。

图片完成流程必须先验证对象，再变更 ACL。删除流程必须持久化清理任务，以支持重试。
