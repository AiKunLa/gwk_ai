# 无法启动

## 症状

`pnpm dev`、`pnpm start` 或构建命令失败。

## 检查

确认 Node.js 22.13+、pnpm 10、依赖安装和 `.env.local` 存在；检查端口是否被占用。

## 修复与验证

重新执行 `pnpm install`，修正环境变量后运行 `pnpm typecheck` 和 `pnpm dev`。不要通过提交密钥来“修复”环境变量错误。
