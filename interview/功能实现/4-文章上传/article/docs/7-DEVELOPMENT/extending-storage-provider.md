# 扩展对象存储提供者

实现 `ObjectStorage` 抽象要求覆盖上传策略、完成校验、读取、删除和失败处理。provider 不应把 SDK 类型泄露到页面或领域层。

新增 provider 后必须补单元测试、服务层集成测试和至少一条上传/删除 E2E 或 smoke check，并更新 `4-INTEGRATIONS` 和 `5-CONFIGURATION`。
