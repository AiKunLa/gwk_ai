# 图片上传生命周期

1. 客户端向 `/api/uploads` 请求上传策略。
2. 服务端生成短期 PostObject 策略，限制 Bucket、对象 key、MIME、ACL、覆盖和大小。
3. 浏览器直传 OSS，并展示进度。
4. 客户端调用 `/api/uploads/:id/complete`。
5. 服务端执行 HEAD、长度、Content-Type 和文件魔数校验。
6. 校验通过后才允许公开读取，并把资源关联到文章。

上传记录和对象状态必须可追踪。失败上传和未被文章引用的对象由清理服务处理。
