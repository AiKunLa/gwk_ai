# 选择你的使用路径

## 本机快速体验

适合只想打开页面并创建文章的人。使用 `.env.example`，按[本地快速启动](quick-start-local.md)执行即可。

## 真实阿里云 OSS

适合验证真实对象存储上传。先阅读[安装前置条件](../1-INSTALLATION/prerequisites.md)，再按[阿里云 OSS 初始化](../1-INSTALLATION/aliyun-oss-setup.md)创建 Bucket、CORS 和 RAM 权限。

## fake OSS 测试

适合运行 Playwright 和集成测试。fake OSS 只属于测试替身，不能作为生产存储，见[使用 fake OSS 运行测试](quick-start-with-fake-oss.md)。

## 开发扩展

修改编辑器从[开发架构](../7-DEVELOPMENT/architecture.md)和[扩展 Tiptap 编辑器](../7-DEVELOPMENT/extending-tiptap-editor.md)开始；修改存储从[扩展对象存储提供者](../7-DEVELOPMENT/extending-storage-provider.md)开始。
