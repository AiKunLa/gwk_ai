# 环境变量参考

| 变量 | 必填条件 | 默认值 | 敏感级别 | 修改后重启 |
|---|---|---|---|---|
| `APP_ORIGIN` | 始终 | `http://127.0.0.1:3000` | 普通 | 是 |
| `ARTICLE_DB_PATH` | 始终 | 见 `.env.example` | 普通 | 是 |
| `OSS_REGION` | 真实 OSS | 无 | 普通 | 是 |
| `OSS_BUCKET` | 真实 OSS | 无 | 普通 | 是 |
| `OSS_ACCESS_KEY_ID` | 真实 OSS | 无 | 敏感 | 是 |
| `OSS_ACCESS_KEY_SECRET` | 真实 OSS | 无 | 高敏感 | 是 |
| `OSS_PUBLIC_BASE_URL` | 真实 OSS | 无 | 普通 | 是 |
| `OSS_ENDPOINT` | 可选 | SDK 默认 | 普通 | 是 |
| `OSS_STS_TOKEN` | 使用 STS 时 | 无 | 高敏感 | 是 |
| `E2E_FAKE_OSS` | E2E 测试 | 未设置 | 测试开关 | 测试启动时 |
| `E2E_FAKE_OSS_TOKEN` | E2E 测试 | 无 | 测试密钥 | 测试启动时 |

`E2E_FAKE_OSS` 和 `E2E_FAKE_OSS_TOKEN` 只由 Playwright 测试环境设置，不应写入普通开发或共享环境。密钥不能使用 `NEXT_PUBLIC_` 前缀，也不能提交 `.env.local`。新增变量时必须同步 `.env.example`、安装文档和测试配置说明。
