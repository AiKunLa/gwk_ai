# 字里文章发布 Demo

一个可本地运行的 Next.js 16 全栈发帖 Demo。正文使用 Tiptap JSON 作为唯一数据源，文章与资源元数据保存在 SQLite，图片通过服务端签名后由浏览器直传阿里云 OSS。

## 功能

- 文章列表、草稿箱、创建、编辑、预览、发布、详情和删除
- Tiptap 标题、粗体、斜体、删除线、引用、列表、代码、链接、撤销与重做
- 点击、拖拽和粘贴图片上传，带上传进度与失败提示
- 图片替代文本、说明、对齐、尺寸和删除
- 独立封面；未设置时使用正文第一张图片
- 每 15 秒自动保存，revision 乐观锁避免多标签页覆盖
- JPG、PNG、WebP、GIF；单张 5 MB；每篇最多 20 个唯一图片资源
- 服务端 HTML 白名单清洗、同源写入校验、请求限流和安全响应头
- 过期上传、孤儿资源和文章删除的持久化 OSS 清理队列

## 环境要求

- Node.js 22.13 或更高版本
- pnpm 10
- 阿里云 OSS Bucket

项目使用 Node 22 内置 `node:sqlite`，无需安装本地 SQLite 或 C++ 构建工具。Node 22 运行时可能输出 SQLite experimental warning，不影响数据读写。

## 本地运行

```powershell
pnpm install
pnpm exec playwright install chromium
Copy-Item .env.example .env.local
pnpm dev
```

打开 `http://127.0.0.1:3000`。服务默认只绑定本机回环地址。

`.env.local` 中必须填写：

| 变量 | 用途 |
|---|---|
| `APP_ORIGIN` | 写接口允许的精确来源，默认 `http://127.0.0.1:3000` |
| `ARTICLE_DB_PATH` | SQLite 文件位置 |
| `OSS_REGION` | 例如 `oss-cn-hangzhou` |
| `OSS_BUCKET` | Bucket 名称 |
| `OSS_ACCESS_KEY_ID` | RAM 子账号或 STS AccessKey ID |
| `OSS_ACCESS_KEY_SECRET` | RAM 子账号或 STS AccessKey Secret |
| `OSS_PUBLIC_BASE_URL` | 图片公开读取的基础 URL，可使用 CDN 域名 |
| `OSS_ENDPOINT` | 可选，自定义 HTTPS 上传 Endpoint；启动时会加入 CSP |
| `OSS_STS_TOKEN` | 可选，临时 STS Token |

密钥不能使用 `NEXT_PUBLIC_` 前缀，也不要提交 `.env.local`。

## OSS 配置

Bucket 按已确认需求设置为公开读取并禁止静态网站托管。Bucket 必须从未开启过版本控制，当前状态必须为“未开启”；“暂停”不满足要求。上传对象会先以对象级 `private` ACL 写入，通过服务端校验后才切换为 `public-read`。草稿图片采用不可预测 URL，但完成校验后知道 URL 的人仍能访问，因此不要上传敏感内容。

CORS 规则至少包含：

```json
[
  {
    "AllowedOrigins": ["http://127.0.0.1:3000"],
    "AllowedMethods": ["POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 600
  }
]
```

使用独立 RAM 子账号，仅授予目标 Bucket `posts/*` 前缀的 `PutObject`、`GetObject`、`DeleteObject` 和 `PutObjectACL` 权限。不要使用阿里云主账号 AccessKey，也不要授予 Bucket 管理权限。

上传流程为：服务端校验文件元数据并生成 2 分钟 PostObject 策略，策略精确限制 Bucket、对象 key、MIME、私有 ACL、禁止覆盖和 1–5 MB 大小；浏览器使用 XHR 直传；完成接口再执行 OSS HEAD、长度、Content-Type 和文件魔数校验，全部通过后才公开对象。`x-oss-forbid-overwrite` 在开启或暂停版本控制的 Bucket 中会被忽略，因此本 Demo 要求 Bucket 从未开启过版本控制，并保持“未开启”状态。

## 测试与构建

```powershell
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
```

Vitest 覆盖领域规则、SQLite 仓储、服务、HTTP 契约、安全渲染和上传客户端，四项全局门槛均为 80%。Playwright 使用仅测试环境启用的同源假 OSS，不读取真实 OSS 密钥。

## 资源清理

上传完成但未被文章引用的资源保留 1 小时，未完成上传记录保留 24 小时。创建新上传意图时会机会式处理少量到期任务，也可以手动执行：

```powershell
pnpm cleanup:assets
```

OSS 删除失败时任务保留在 SQLite，并按退避时间重试。文章删除先持久化删除任务，再删除文章数据，避免外部服务失败时丢失待清理对象。

## 安全边界

该版本按需求不包含登录，仅适合本机 Demo。任何能访问服务的人都可以创建、修改和删除文章；部署到局域网或公网前必须增加认证、授权和持久化分布式限流。
