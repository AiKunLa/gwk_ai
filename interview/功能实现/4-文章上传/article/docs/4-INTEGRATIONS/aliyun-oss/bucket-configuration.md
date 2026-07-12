# Bucket 配置

- 版本控制必须保持“未开启”；“暂停”不满足当前上传策略假设。
- 禁止静态网站托管。
- 对象按应用约定的 `posts/*` 前缀保存。
- 上传阶段使用私有 ACL，校验完成后才公开读取。
- `OSS_PUBLIC_BASE_URL` 应与实际公共访问域名一致，可使用 CDN 域名。

Bucket 具体创建流程见[OSS 初始化](../../1-INSTALLATION/aliyun-oss-setup.md)。
