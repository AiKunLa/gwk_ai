# 测试配置参考

- Vitest 覆盖领域、仓储、服务、HTTP 和组件测试。
- Playwright 使用独立测试服务器和 fake OSS。
- E2E 测试运行时设置 `E2E_FAKE_OSS=1` 和随机 `E2E_FAKE_OSS_TOKEN`。
- E2E 不读取真实 OSS 密钥。
- 测试数据库和对象数据必须隔离，测试结束后清理。
- 覆盖率目标为 80%。

完整命令和分层策略见[测试策略](../7-DEVELOPMENT/testing.md)。
