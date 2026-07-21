# 本地快速启动

## 前置条件

- Node.js 22.13 或更高版本
- pnpm 10
- Windows 本地运行时建议使用 PowerShell

## 启动

```powershell
pnpm install
pnpm exec playwright install chromium
Copy-Item .env.example .env.local
pnpm dev
```

打开 `http://127.0.0.1:3000`，创建一篇草稿并确认列表、预览和详情页面可用。

## 验证

```powershell
pnpm typecheck
pnpm lint
pnpm test
```

真实 OSS 环境变量见[环境变量参考](../5-CONFIGURATION/environment-variables.md)。没有真实 OSS 时，请使用测试路径，不要填入虚假密钥。
