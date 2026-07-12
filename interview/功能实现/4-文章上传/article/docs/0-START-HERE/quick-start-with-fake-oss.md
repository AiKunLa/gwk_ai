# 使用 fake OSS 运行测试

fake OSS 是测试专用对象存储替身，由 Playwright 的测试环境启用。它用于验证上传、完成、删除和失败重试，不会读取真实 OSS 密钥。

## 运行 E2E

```powershell
pnpm test:e2e
```

## 边界

- 只在测试环境使用
- 不代表阿里云 CORS、ACL 或签名行为
- 不应把 fake OSS 开关带到共享或公网环境
- 真实 OSS 验证仍需执行集成配置和人工 smoke check

测试配置和生命周期见[测试配置](../5-CONFIGURATION/testing-configuration.md)与[fake OSS E2E 行为](../4-INTEGRATIONS/fake-oss/e2e-behavior.md)。
