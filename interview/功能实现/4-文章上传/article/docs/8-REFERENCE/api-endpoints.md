# HTTP API 参考

稳定对外路径如下：

| 方法 | 路径 | 用途 |
|---|---|---|
| `GET` | `/api/articles` | 查询文章列表 |
| `POST` | `/api/articles` | 创建文章 |
| `GET` | `/api/articles/:id` | 查询文章详情 |
| `PATCH` | `/api/articles/:id` | 更新文章或状态 |
| `DELETE` | `/api/articles/:id` | 删除文章并安排清理 |
| `POST` | `/api/uploads` | 创建上传策略 |
| `POST` | `/api/uploads/:id/complete` | 完成上传并校验对象 |

`/api/test-oss` 仅在 `E2E_FAKE_OSS=1` 测试环境可用，不是普通或生产 API。

具体请求体、响应 envelope、revision 和错误码以对应 route 测试为准，变更时必须同步本文档。
