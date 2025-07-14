# 创建 node 后端项目

- 初始化 node 后端项目
  npm init -y
- 安装 express node 后端框架
  npm i express
  npm i -g nodemon // 热更新

## 创建 index.js 文件

- 创建 index.js 文件
  touch index.js
- 编写代码
  ```js
  const express = require("express");
  console.log(express);

  // 创建一个express的应用
  //创建Express应用实例 app ，该实例是整个Web应用的入口，用于定义路由、中间件和业务逻辑。
  const app = express();
  // http 是node内置的模块，
  //将Express应用 app 作为参数传递给HTTP服务器，使Express接管HTTP请求处理。
  const http = require("http").Server(app);

  // 监听端口  伺服状态 伺候用户
  http.listen(1314, () => {
    console.log("服务器启动成功");
  });

  app.get("/", (req, res) => {
    // 返回index.html
    // __dirname 项目根目录
    res.sendFile(__dirname + "/index.html");
  });
  ```

- require是什么
node有两套模块化方案，require 是node早期模块化方案，import是es6的模块化方案

 - 什么是模块化




## 请求
- http 足够简单，用户请求完毕后会立即断开，适配高并发访问

