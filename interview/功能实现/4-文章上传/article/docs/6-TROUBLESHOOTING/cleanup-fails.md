# 资源清理失败

## 症状

OSS 对象删除失败，清理任务持续重试或孤儿对象增加。

## 检查

查看清理任务状态、对象 key、RAM `DeleteObject` 权限、Endpoint 和网络连通性。

## 修复与验证

修正权限或网络后执行 `pnpm cleanup:assets`，确认任务状态更新并核对对象是否删除。
