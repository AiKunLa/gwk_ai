# OSS 参数参考

真实 OSS 至少需要 Region、Bucket、AccessKey ID、AccessKey Secret 和公共访问基础 URL。可选 Endpoint 用于自定义 HTTPS 上传地址，STS Token 用于临时凭证。

上传 key、ACL、Bucket 目标和公共 URL 必须与[阿里云 OSS 集成](../4-INTEGRATIONS/aliyun-oss/index.md)保持一致。测试环境使用 fake OSS，不应填入真实密钥。
