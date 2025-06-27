//
// require是node最初commonjs的模块化方案
// express 是
const express = require("express");
console.log(express);

// 创建一个express的应用
//创建Express应用实例 app ，该实例是整个Web应用的入口，用于定义路由、中间件和业务逻辑。
const app = express();
// http 是node内置的模块，
const http = require("http").Server(app);

// 监听端口
http.listen(3000, () => {
  console.log("服务器启动成功");
  console.log(__dirname);
});

app.get("/", (req, res) => {
  // 返回index.html
  // response 响应体，request 请求，浏览器（proxy） url  localhost:端口+ get（方法） + /路径
  // http 足够简单
  res.sendFile(__dirname + "/index.html");
});

app.get("/get", (req, res) => {
  // setInterVal 是用于 周期性地重复执行指定的代码
  // 设置相应头
  res.set({
    // 文本流 这是服务器启动（SSE ）的核心配置  触发EventSource
    // SSE（Server-Sent Events）是一种服务器向客户端推送实时数据的Web技术，通过HTTP长连接实现单向持续通信。
    "Content-Type": "text/event-stream",  

    // 缓存  不缓存 表示
    /**
     * 它明确告诉浏览器不要缓存响应内容，确保客户端能够实时接收服务器推送的最新数据，
     * 避免因缓存导致的数据流延迟或重复问题。
     */
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  // 刷新响应头 告诉浏览器可以接受事件流了
  res.flushHeaders();

  setInterval(() => {
    const message = `Current time is ${new Date().toLocaleString()}`;
    // res.write(`data: ${message}\n\n`);
    let num = Math.floor(Math.random() * 10);
    res.write(`data:${num}\n\n`);
  },100);
});
