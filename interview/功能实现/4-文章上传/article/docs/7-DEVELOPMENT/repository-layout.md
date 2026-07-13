# 仓库布局

- `app/`：页面、布局和 API 路由
- `components/`：页面组件和 Tiptap 编辑器
- `lib/domain/`：文章、内容和图片领域规则
- `lib/rich-text/`：编辑器扩展和渲染
- `lib/server/db/`：SQLite 和仓储
- `lib/server/services/`：文章、上传和清理服务
- `lib/server/storage/`：对象存储抽象、阿里云和 fake provider
- `e2e/`：Playwright 测试生命周期和用户流程
- `scripts/`：清理等运维脚本

进入高复杂目录前先阅读同目录的 `AGENTS.md` 或 `README.md`。
