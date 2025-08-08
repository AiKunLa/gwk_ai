const http = require("http");

const server = http.createServer((req, res) => {
  // 处理跨域 - 只允许localhost:5173访问
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 允许的请求头
  //   res.setHeader("Access-Control-Allow-Credentials", "true"); // 如果需要携带cookie

  // 处理预检请求(OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  if (req.url === "/api/hello" && req.method === "GET") {
    console.log("/hello");
    // 响应js代码

    res.writeHead(200, { "Content-Type": "application/javascript" });

    // json with padding
    const callback = req.query.callback;
    const data = { message: "hello world" };
      
    res.end(`${callback}(${JSON.stringify(data)})`);
    return;
  }

  // 处理其他路由
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(8080, () => {
  console.log("server is running at http://localhost:8080");
});
