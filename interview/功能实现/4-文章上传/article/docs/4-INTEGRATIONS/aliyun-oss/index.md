# 阿里云 OSS 集成

本页面向需要配置真实对象存储的开发者和运维人员。浏览器直传使用服务端生成的 PostObject 策略，上传完成后由服务端执行对象校验和 ACL 变更。

推荐顺序：Bucket 配置 → CORS → RAM 最小权限 → ACL 与版本控制。

- [Bucket 配置](bucket-configuration.md)
- [CORS 配置](cors-configuration.md)
- [RAM 最小权限](ram-permissions.md)
- [ACL 与版本控制](acl-and-versioning.md)

不要使用主账号 AccessKey，也不要把密钥放进 `NEXT_PUBLIC_*` 环境变量。版本控制必须保持“未开启”。
