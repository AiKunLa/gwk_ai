# CORS 配置

至少允许当前 `APP_ORIGIN`，例如 `http://127.0.0.1:3000`。

建议允许的方法为 `POST`，允许浏览器发送的必要请求头，暴露 `ETag`，并设置有限的 `MaxAgeSeconds`。不要把 `*` Origin 作为长期配置。

CORS 错误会表现为浏览器上传失败或预检失败，见[OSS CORS 或 403](../../6-TROUBLESHOOTING/oss-cors-or-403.md)。
