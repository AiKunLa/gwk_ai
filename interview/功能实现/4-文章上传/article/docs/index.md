# 文档总入口

这里按“我要完成什么”组织文档，而不是按源码目录组织。先选择目标，再进入对应分区。

## 选择路径

| 你的目标 | 从这里开始 |
|---|---|
| 第一次了解项目 | [项目概览](0-START-HERE/project-overview.md) |
| 用于技术评审或面试汇报 | [技术方案（汇报版）](0-START-HERE/technical-solution-report.md) |
| 快速在本机运行 | [本地快速启动](0-START-HERE/quick-start-local.md) |
| 配置真实阿里云 OSS | [OSS 初始化](1-INSTALLATION/aliyun-oss-setup.md) |
| 学习创建和发布文章 | [用户指南](3-USER-GUIDE/index.md) |
| 理解上传和清理机制 | [核心概念](2-CORE-CONCEPTS/index.md) |
| 查环境变量和运行参数 | [配置参考](5-CONFIGURATION/index.md) |
| 遇到启动、保存或上传问题 | [排障手册](6-TROUBLESHOOTING/index.md) |
| 修改代码或增加扩展 | [开发者文档](7-DEVELOPMENT/index.md) |
| 查询 API、数据模型或错误码 | [参考手册](8-REFERENCE/index.md) |

## 推荐阅读顺序

新用户：`0-START-HERE` → `1-INSTALLATION` → `3-USER-GUIDE`

运维人员：`1-INSTALLATION` → `4-INTEGRATIONS` → `5-CONFIGURATION` → `6-TROUBLESHOOTING`

开发者：`2-CORE-CONCEPTS` → `7-DEVELOPMENT` → `8-REFERENCE`

## 项目边界

当前版本没有登录、授权、多用户隔离或分布式数据库。它适合本机和受限内网演示，不应直接作为公网生产系统使用。公网部署需要先补充认证、授权、持久化限流、密钥管理和审计能力。

## 分区导航

- [0. 开始这里](0-START-HERE/index.md)
- [1. 安装与运行](1-INSTALLATION/index.md)
- [2. 核心概念](2-CORE-CONCEPTS/index.md)
- [3. 用户指南](3-USER-GUIDE/index.md)
- [4. 外部集成](4-INTEGRATIONS/index.md)
- [5. 配置参考](5-CONFIGURATION/index.md)
- [6. 排障](6-TROUBLESHOOTING/index.md)
- [7. 开发与贡献](7-DEVELOPMENT/index.md)
- [8. 稳定参考](8-REFERENCE/index.md)
