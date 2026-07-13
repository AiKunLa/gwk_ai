# Storage 模块

本目录实现 `ObjectStorage` 抽象、阿里云 provider、fake provider、上传策略和对象验证。

## 安全契约

对象先以 `private` 上传，服务端完成 HEAD、长度、Content-Type 和文件魔数校验后才公开读取。provider 不得绕过校验或泄露密钥。

新增 provider 必须实现上传、完成、读取和删除契约，补单元/集成测试，并更新 `docs/4-INTEGRATIONS` 与 `docs/5-CONFIGURATION`。
