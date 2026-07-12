# 项目概览

## 项目定位

这是一个本地优先的文章发布 Demo，用于演示 Tiptap 富文本、浏览器直传对象存储、草稿自动保存和资源清理的完整链路。

## 核心功能

- 文章列表、草稿、新建、编辑、预览、发布、详情和删除
- Tiptap JSON 正文模型与服务端 HTML 清洗
- 点击、粘贴、拖拽图片上传
- 封面、替代文本、说明、对齐和尺寸控制
- 15 秒自动保存与 revision 乐观锁
- SQLite 元数据、阿里云 OSS 图片和孤儿资源清理

## 技术边界

Node.js 22、Next.js 16、React 19、Tiptap 3、SQLite、`ali-oss`、Zod、Vitest 和 Playwright。

项目没有登录、授权或多用户隔离。它适合本机和受限内网演示，不适合直接公网部署。

## 数据路径

文章正文以 Tiptap JSON 保存在 SQLite；图片先由服务端签发上传策略，再由浏览器直传 OSS，完成后服务端校验对象并更新 ACL。

下一步：阅读[选择你的使用路径](choose-your-path.md)。
