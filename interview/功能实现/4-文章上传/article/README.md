# 字里文章发布 Demo

一个本地优先的 Next.js 全栈文章发布 Demo。正文使用 Tiptap JSON 保存，文章元数据保存在 SQLite，图片通过服务端签名后由浏览器直传阿里云 OSS。

## 适合谁

- 想体验 Tiptap 富文本编辑、图片上传和文章发布流程的人
- 需要参考 Next.js、SQLite 与对象存储组合方式的前端/全栈开发者
- 需要验证阿里云 OSS 上传策略、对象校验和资源清理流程的人

当前版本不包含登录、授权和多用户隔离，只适合本机或受限内网 Demo，不应直接部署到公网。

## 核心能力

- 草稿、新建、编辑、预览、发布、详情和删除
- Tiptap 富文本编辑与图片节点管理
- 点击、粘贴、拖拽图片上传
- 自动保存、revision 乐观锁和冲突提示
- 服务端 HTML 清洗、文件类型校验和 OSS 资源清理

## 最短启动路径

环境要求：Node.js 22.13+、pnpm 10。

```powershell
pnpm install
pnpm exec playwright install chromium
Copy-Item .env.example .env.local
pnpm dev
```

打开 <http://127.0.0.1:3000>。

真实 OSS 的环境变量和 Bucket 配置见 [文档总入口](docs/index.md)。测试环境使用 fake OSS，见 [测试路径](docs/0-START-HERE/quick-start-with-fake-oss.md)。

## 常用命令

```powershell
pnpm test
pnpm test:coverage
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
pnpm cleanup:assets
```

## 文档

- [文档总入口](docs/index.md)
- [本地安装](docs/1-INSTALLATION/local-development.md)
- [阿里云 OSS 配置](docs/1-INSTALLATION/aliyun-oss-setup.md)
- [用户指南](docs/3-USER-GUIDE/index.md)
- [排障手册](docs/6-TROUBLESHOOTING/index.md)
- [开发者文档](docs/7-DEVELOPMENT/index.md)
- [API 与数据模型参考](docs/8-REFERENCE/index.md)

不要把 `.env.local`、AccessKey 或其他密钥提交到仓库。详细安全边界见 [安全边界](docs/2-CORE-CONCEPTS/security-boundaries.md)。
