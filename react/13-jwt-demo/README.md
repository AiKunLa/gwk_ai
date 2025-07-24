# 13-jwt-demo
- 使用linux 命令来发送post请求
    curl -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"123456"}' http://localhost:3000/login
- 登录成功后，会返回一个token，后续的请求都需要在header中添加token
    curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000/users

- 安装依赖
    # 安装路由依赖
    pnpm i react-router-dom 
    # 安装axios
    pnpm i axios 
    # 安装jwt 库
    pnpm i jsonwebtoken
    # 安装zustand 状态管理库
    pnpm i zustand

1. 通过cookie来实现登录授权
    - http请求是无状态的，服务器端无法知道客户端是否登录
        服务端需要在用户登录后，将token保存到cookie中，客户端后续的请求会自动携带cookie，服务端可以通过cookie来判定用是否登录

2. jwt实现登录授权
    由于cookie是明文传输的，存在安全隐患，所以在实际项目中，建议使用jwt来实现登录授权
    登录成功后服务器会返回一个token，后续的请求都需要在header的authorization中添加token。

    token每次请求都会携带在header中，这是通过axios的interceptors来实现的。

    - jwt是一种基于json的，用于在网络上传输数据的格式
    - jwt由三部分组成，header、payload、signature
        - header：指定了生成jwt的算法
        - payload：存储了用户的信息
        - signature：用于验证jwt的有效性

    这里的secret是一个字符串，用于加密jwt，在实际项目中，建议使用环境变量来存储secret，表示的是加盐
    传递token时，在其前面添加Bearer空格，这是jwt的标准格式
    ```JS
        import jwt from 'jsonwebtoken';
        // 颁发一个token
        const token = jwt.sign({ username }, secret, {
            expiresIn: "1h",
        });
    ```

    ```js
        // 验证token
        // 从header中获取token
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                return {
                    code: 1,
                    msg: "token无效",
                };
            }
            return {
                code: 0,
                msg: "token有效",
                payload,
            };
        });
    ```

    - api 请求拦截
        - 从localStorage中获取token
        - 将token添加到header的authorization中

    - 响应拦截
        - 从响应头中获取token
        - 将token保存到localStorage中
    - token 中
        `Bearer ${token}` Bearer 表示这是token的持有者

