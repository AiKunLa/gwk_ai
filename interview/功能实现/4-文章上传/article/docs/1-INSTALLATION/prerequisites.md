# 安装前置条件

## 必需软件

- Node.js 22.13+
- pnpm 10+
- Chromium（运行 Playwright 时需要）

项目使用 Node.js 内置 `node:sqlite`，不需要单独安装 SQLite 服务或 C++ 构建工具。

## 真实 OSS 前置条件

- 阿里云 OSS Bucket
- 独立 RAM 子账号
- 允许当前 `APP_ORIGIN` 的 CORS
- 版本控制保持“未开启”
- 可公开读取对象，但禁止静态网站托管

不要使用阿里云主账号 AccessKey，也不要把密钥写入 `NEXT_PUBLIC_*` 变量。
