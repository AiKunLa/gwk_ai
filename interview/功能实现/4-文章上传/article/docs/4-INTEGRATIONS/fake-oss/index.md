# fake OSS

fake OSS 是本地测试和 Playwright E2E 的对象存储替身，用于模拟上传、完成、读取、删除和失败重试。

它不提供真实阿里云的 CORS、签名、ACL 和网络行为，不能用于生产或共享环境。测试启动方式见[E2E 行为](e2e-behavior.md)。
