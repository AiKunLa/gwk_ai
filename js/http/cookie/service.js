// 在路由配置前添加
const express = require("express");
const app = express();

// 解析 application/json
app.use(express.json());
// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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

app.post("/login", (req, res) => {
  console.log(req.body);
  // 反序列化
  const { username, password } = req.body;
  res.writeHead(200, {
    "Set-Cookie": "username=admin",
    "Content-Type": "application/json",
  });
  const data = {
    code: 0,
    msg: "登录成功",
    data: null,
  };
  if (username === "admin" && password === "123456") {
    data.data = {
      username: "admin",
      token: "123456",
    };
  } else {
    data.code = 1;
    data.msg = '登录失败';
    data.data = null;
  }
  res.end(JSON.stringify(data));
});

app.get("/check-login", (req, res) => {
  const cookie = req.header.Cookie;
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  let data = {
    code: 0,
    msg: "登录成功",
    data: null,
  };
  if (cookie) {
    data.data = {
      username: "admin",
      token: "123456",
    };
  } else {
    data.code = 1;
    data.msg = "未登录";
  }
  res.end(JSON.stringify(data));
});

app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/index.css");
});

app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});
