// node 后端
// http 是 node 内置的核心模块
// js在命令行运行 即为后端
// require 是什么
const http = require("http");
const fs = require("fs"); // file system
const path = require("path"); // 路径模块
const { url } = require("inspector");

// 创建服务器
const server = http.createServer((req, res) => {
  // http是基于请求和相应的协议
  // 判定请求方式 与 路径。 路由=methode+url（统一资源定位符） ，定位了服务器端的资源
  // 协议://[用户名:密码@]域名[:端口]/路径/[?查询参数]#片段
  // 这样是为了获取服务资源，

  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    // 第一个参数是拼接资源路径 第二个参数是回调函数
    fs.readFile(path.join(__dirname, "public", "index.html"), (err, data) => {
      // 发生错误
      if (err) {
        res.writeHead(500, {
          "Content-Type": req.url.endsWith(".css")
            ? "text/css"
            : "text/html; charset=utf-8",
        }); // 5XX 服务器错误
        res.end("Server Error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html;charset=utf- 8",
      });
      res.end(data);
    });
  }

  if (req.method === "GET" && req.url === "/style.css") {
    // 第一个参数是拼接资源路径 第二个参数是回调函数
    fs.readFile(path.join(__dirname, "public", "style.css"), (err, data) => {
      // 发生错误
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/css;charset=utf- 8"
        }); // 5XX 服务器错误
        res.end("Server Error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html;charset=utf- 8",
      });
      res.end(data);
    });
  }
});

// 监听端口
server.listen(8080, () => {
  console.log("服务器启动成功");
});
