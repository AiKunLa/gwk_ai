# API 路由局部指南

本目录负责 Next.js API 路由和 HTTP 边界，不负责领域规则、数据库 SQL 或 OSS SDK 细节。

## 必须遵守

- 使用 Zod 或现有 schema 校验所有外部输入。
- 使用统一响应 envelope 和稳定错误码。
- 保留同源校验、限流和安全响应头。
- 通过 service 层访问领域、仓储和对象存储。
- 不把 AccessKey、内部堆栈或 SDK 原始错误返回给客户端。

## 扩展流程

新增 route 时先补 HTTP 契约测试，再连接服务层，最后更新 `docs/8-REFERENCE/api-endpoints.md` 和相关排障文档。
