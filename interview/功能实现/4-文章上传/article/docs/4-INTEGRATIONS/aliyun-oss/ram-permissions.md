# RAM 最小权限

使用独立 RAM 子账号，只允许目标 Bucket 的 `posts/*` 前缀执行：

- `PutObject`
- `GetObject`
- `DeleteObject`
- `PutObjectACL`

不要使用主账号 AccessKey，也不要授予 Bucket 管理权限。密钥应通过未提交的环境变量或密钥管理系统注入，并定期轮换。
