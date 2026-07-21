# 本地开发工作流

1. 明确需求影响的页面、API、领域规则和外部服务。
2. 先补失败测试，再实现最小行为。
3. 运行聚焦测试、类型检查和 lint。
4. 涉及跨层行为时运行集成测试和 E2E。
5. 同步用户文档、配置参考、API 参考和排障文档。

常用命令：`pnpm test`、`pnpm test:coverage`、`pnpm typecheck`、`pnpm lint`、`pnpm build`、`pnpm test:e2e`。
