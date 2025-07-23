import jwt from "jsonwebtoken";

// 模拟数据库
// 用户表
const users = [
  {
    userId: 1,
    username: "admin",
    passward: "123456",
  },
];

// 爱好表
const likes = [
  {
    userId: 1,
    hobbyList: [
      { id: 1, name: "阅读" },
      { id: 2, name: "游泳" },
      { id: 3, name: "跑步" },
    ],
  },
  {
    userId: 2,
    hobbyList: [
      { id: 4, name: "绘画" },
      { id: 5, name: "音乐" },
    ],
  },
];

// 定义加密的密钥 加盐
const secret = "86_486_0105";

// 创建登录mock
export default [
  {
    url: "/login",
    method: "POST",
    response: (req) => {
      const { username, password } = req.body;
      console.log("登录参数", username, password);

      const user = users.find((item) => item.username === username);
      if (user && user.passward === password) {
        // 使用算法生成token
        const token = jwt.sign(user, secret, {
          expiresIn: "1h",
        });
        return {
          code: 0,
          msg: "登录成功",
          // 生成一个随机的token
          data: {
            user: {
              userId: user.userId,
              username: user.username,
            },
            token,
          },
        };
      }

      return {
        code: 1,
        msg: "用户名或密码错误",
      };
    },
  },
  {
    url: "/getLikeList",
    method: "GET",
    response: (req) => {
      const token = req.headers["authorization"].split(" ")[1];
      try {
        // 解析token 获取用户对象
        const payload = jwt.verify(token, secret);

        //  用户是否存在
        const user = findUser(payload.userId);

        if (!user) throw new Error("token错误");
        // 是否过期
        if (payload.exp < Date.now() / 1000) throw new Error("token过期");

        // 查询用户爱好
        const likeList = likes.find((item) => item.userId === payload.userId);

        // 成功
        return {
          code: 0,
          msg: "获取成功",
          data: likeList,
        };
      } catch (error) {
        return {
          code: 1,
          msg: "token错误",
        };
      }
    },
  },
];

// 查找数据库
const findUser = (userId) => {
  return users.find((item) => item.userId === userId);
};
