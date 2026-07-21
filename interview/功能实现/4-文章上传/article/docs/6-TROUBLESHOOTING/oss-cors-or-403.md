# OSS CORS 或 403

## 症状

浏览器预检失败、直传返回 403 或对象读取失败。

## 检查

核对 `APP_ORIGIN`、Bucket CORS、Region、Endpoint、RAM 权限、对象 ACL 和版本控制状态。

## 修复与验证

只允许实际来源并补齐最小权限，重新生成策略后测试上传。不要直接授予 Bucket 管理权限。
