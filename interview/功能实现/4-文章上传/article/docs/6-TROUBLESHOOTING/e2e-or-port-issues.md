# E2E 或端口问题

## 症状

Playwright 无法启动浏览器、测试服务器或端口被占用。

## 检查

执行 `pnpm exec playwright install chromium`，检查测试服务器日志、端口和 fake OSS 测试环境。

## 修复与验证

关闭残留进程后重新运行 `pnpm test:e2e`。确认测试没有读取真实 OSS 密钥。
