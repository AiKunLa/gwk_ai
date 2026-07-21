# 阿里云 OSS 初始化

## Bucket

创建用于文章图片的 Bucket，保持版本控制为“未开启”，禁止静态网站托管。对象上传阶段使用 `private` ACL，服务端完成文件校验后才切换为 `public-read`。

## CORS

至少允许当前 `APP_ORIGIN`，方法包含 `POST`，允许必要请求头，并暴露 `ETag`。不要使用任意来源作为长期配置。

## RAM

只授予目标 Bucket 的 `posts/*` 前缀所需的 `PutObject`、`GetObject`、`DeleteObject` 和 `PutObjectACL` 权限。不要授予 Bucket 管理权限。

## 环境变量

配置 `OSS_REGION`、`OSS_BUCKET`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET` 和 `OSS_PUBLIC_BASE_URL`。可选配置 `OSS_ENDPOINT` 与 `OSS_STS_TOKEN`。

详细参数见[OSS 集成](../4-INTEGRATIONS/aliyun-oss/index.md)和[环境变量参考](../5-CONFIGURATION/environment-variables.md)。
