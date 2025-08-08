const http = require("http");

const server = http.createServer((req, res) => {
  // 设置允许跨域的域名
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 允许的请求方法
  res.setHeader("Access-Control-Allow-Methods", "POST,DELETE");
  // 允许的请求头
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  // 预检请求
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Methods": "POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }


  if (req.url.startsWith("/say")) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    const data = {
      code: 0,
      msg: "success",
      data: {
        // 结合时间戳和随机数
        token:
          Date.now().toString(36) + "_" + Math.random().toString(36).slice(2),
      },
    };

    res.end(JSON.stringify(data));
  }
});
server.listen(8080, () => {
  console.log("server running at http://localhost:8080");
});
