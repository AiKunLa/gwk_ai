// server.js - 原生 Node.js 版本
const http = require("http");

const server = http.createServer((req, res) => {
  // 匹配 GET 请求 /say
  if (req.url.startsWith("/say")) {
    // 解析查询参数（简单处理）
    // 解析url 创建url实例 形成一个完成的url对象  因为req.url 是没有前面的域名之类的
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log("url", url); // 一个url对象

    console.log("88888888", req.url); //say?callback=biaobaiCallback&wd=ilikeyou

    const wd = url.searchParams.get("wd");
    const callback = url.searchParams.get("callback");

    console.log(wd); // Iloveyou
    console.log(callback); // show

    // 返回 JSONP 格式响应
    // 配置编码格式
    res.writeHead(200, {
      "Content-Type": "application/javascript",
    });

    const data = {
      code: 0,
      msg: "success",
      data: {
        name: "DPE",
        age: 18,
      },
    };
    
    // 解决中文乱码问题
    res.end(`${callback}(${JSON.stringify(data)})`);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
