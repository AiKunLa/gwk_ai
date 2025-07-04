const express = require("express");
const cookieParser = require("cookie-parser"); // 引入
const bodyParser = require("body-parser"); // 解析post请求参数
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 使用中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 模拟用户数据库
const users = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "user", password: "user123" },
];

// 定义端口
app.listen(PORT, () => {
  console.log(`服务启动成功 http://localhost:${PORT}`);
});

// 首页路由
app.get("/", (req, res) => {
  if (req.cookies.userId) {
    // 若cookie中有用户数据 则转跳到用户页面
    res.redirect("/userIndex");
  } else {
    // 否则进入登录界面
    res.redirect("/login");
  }
});

// 获取登录界面
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// 获取用户界面
app.get("/userIndex", (req, res) => {
  res.sendFile(__dirname + "/user.html");
});

// 登录处理
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 模拟数据库查找
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.cookie("userId", user.id, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    // 发送请求成功
    res.send({ code: 0, msg: "登录成功" });
  } else {
    res.status(401).send("用户名或密码错误");
  }
});

// 用户资料
app.get("/user", (req, res) => {
  const userId = parseInt(req.cookies.userId);
  if (!userId) {
    // 页面转跳
    res.redirect('/login')
    return
  }
  // 查询数据库
  const user = users.find((u) => u.id === userId);

  // 返回数据
  res.send({username:user.username,id:user.id});
});


// 登出
app.get('/logout',(req,res)=>{
    res.clearCookie('userId')
    res.redirect('/login')
})