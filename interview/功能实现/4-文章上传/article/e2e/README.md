# E2E 测试局部指南

Playwright 覆盖文章创建、编辑、上传、发布和删除等关键用户流程。

- 测试服务器由 E2E 生命周期脚本管理。
- 使用 fake OSS，不读取真实 OSS 密钥。
- 测试数据必须隔离并在结束后清理。
- 端口或浏览器问题先看 `docs/6-TROUBLESHOOTING/e2e-or-port-issues.md`。

运行：`pnpm test:e2e`。
