# 测试策略

## 三层测试

- Vitest 单元测试：领域规则、富文本处理、纯函数和组件。
- Vitest 集成测试：SQLite 仓储、服务层、HTTP 契约和 fake storage。
- Playwright E2E：创建、编辑、上传、发布、删除等关键用户流程。

```powershell
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm test:all
```

覆盖率目标为 80%。E2E 使用 fake OSS，禁止读取真实密钥；测试数据必须隔离并在结束后清理。
