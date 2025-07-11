// es6 模块化 
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 文件名
const __filename = fileURLToPath(import.meta.url);
// 文件夹名
const __dirname = path.dirname(__filename);


// 创建服务器
const server = http.createServer((req, res) => {
  res.end("hello node");
  console.log(req.url)
});

server.listen(3000, () => {
    console.log('服务器启动成功')
});
