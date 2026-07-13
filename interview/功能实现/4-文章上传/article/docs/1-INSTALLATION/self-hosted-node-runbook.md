# 受限环境 Node/Next.js 运行手册

本手册只覆盖当前项目可行的 Node/Next.js 单机运行方式。由于项目没有认证和多租户隔离，不应直接作为公网生产部署方案。

## 构建与启动

```powershell
pnpm install
pnpm build
pnpm start
```

## 运行检查

- 进程能绑定配置的地址和端口
- 首页可打开
- `GET /api/articles` 返回成功响应
- 能创建草稿并完成一次图片上传 smoke check
- SQLite 文件和 OSS Bucket 均可写入

## 进程和日志

使用现有进程管理器维护 Node 进程，保留标准输出和错误输出。当前没有独立 health endpoint，健康检查使用首页和文章 API smoke check。

## 公网前置条件

必须先增加认证、授权、持久化限流、密钥托管、审计和备份恢复方案。不要仅依靠反向代理把当前 Demo 暴露到公网。
