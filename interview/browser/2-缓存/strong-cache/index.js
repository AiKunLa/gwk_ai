const http = require("http");
const fs = require("fs");

http
  .createServer(function (request, respone) {
    if (request.url === "/") {
      // 这是异步读取
      // fs.readFile()

      // sync 同步执行
      const html = fs.readFileSync("test.html", "utf-8");
      // 先响应请求头，让浏览器先做好准备
      respone.writeHead(200, {
        "Content-Type": "text/html",
        "Cache-Control": "max-age=20,public",
      });

      respone.end(html);
    }

    if (request.url === "/script.js") {
      respone.writeHead(200, {
        "Content-Type": "text/javascript",
        "Cache-Control":'max-age=20,public'
      });
      const script = fs.readFileSync("script.js", "utf-8");
      respone.end(script);
    }
  })
  .listen(8888);
