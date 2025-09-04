# next.js  双token
- users 和 posts两个表
- jwt 双token鉴权
- 虚拟列表
    结合AI爬虫，爬取掘金100条数据
- 大文件上传
- ai工程化
    流式输出
- ai搜索
    embedding

## 双token机制
    单token 长期存储在localStorage ，容易被第三方拦截，这样不安全 
- 双token  用于提升安全和用户体验
    accessToken 校验身份 重要 在短时间内有效时间2h，用于请求数据
    refreshToken 用于获取accessToken 有效时间为七天，实现无感刷新 

- middleware概念
    中间件 ：Middleware 是中间件，用于在请求和响应之间执行预处理逻辑，如日志、认证、数据解析等。
    NextResponse.next() 放行
    NextResponse.redirect(new URL("/login", request.url)) 重定向去其他页

-  pnpm i jose 安装jose 这是node中用于处理jwt的包
    jwt 的结构
        header 签名的算法 HS256
        载荷 {userId}
        签名 
            secretKey 
- 后端安全和性能
    - 容错处理，try catch
    - 释放数据库对象 prisma.$disconnect()
    - prisma操作
        prisma.user.create()
        prisma.user.update({
            where:{},
            data:{}
        })
        prisma.user.findUnique({
            where:{}
        })
    - 服务器端设置httpOnly 为true 表不能用javascript操作cookie，来防止XSS攻击
    - 设置sameSite为strict ：SameSite 可防止跨站请求伪造（CSRF）攻击，限制 Cookie 在跨域请求中的自动发送，提升安全性。 不同网页限制携带
    ```js  
        cookieStore.set("access_token", accessToken, {
            httpOnly: true, // 这个表示不能用javascript操作cookie  防止XSS攻击（通过js获取cookie）
            maxAge: 60 * 15, // 15分钟
            sameSite: "strict", // SameSite 可防止跨站请求伪造（CSRF）攻击，限制 Cookie 在跨域请求中的自动发送，提升安全性。
            path: "/", // 能够携带的请求路径
        });
    ```
    - 再中间件层通过jwt verify方法拿到payload 后，将其添加到自定义的请求头中，方便后续认证
        x-user-id
        后续页面就可以拿到这个值


## 配置
1. 数据库配置
    - .env
        DATABASE_URL="mysql://root:4718@localhost:3306/blogs"
2. prisma初始化
    prisma是一个对象关系映射工具（ORM工具），可以将对象关系转为表
    将底层数据库操作映射成高级的面向对象操作
    他就是数据库的设计图，相对于navicat 他的好处在于，能结合git留下数据库设计和修改的历史，是文档型、可以追踪的。
    - 命令
        npx prisma init
        pnpm i prisma @prisma/client 它是一个命令行工具，用于管理数据库 schema、迁移。
        - Model 表的映射模型
            @@map('users') 表示模型对应的表名
            posts Post[] 一对多的关系
        - npx prisma migrate dev --name init 将模型迁移到数据库中
    
3. 使用restful API
    lib/ 复用的praima模块

4. regexp
    正则
    /^.+?[]{}$/ test
    ^ 匹配开始字符 $ 结束 
    . 任意一个字符
    ? 匹配0次或一次
    + 一次或多次
    [] 匹配范围
    {} 长度  

5. 使用bcryptjs 进行密码的单项加密
    pnpm i bcryptjs
    每一次登录实际上都是对密码加密后再进行比较，数据库中存储的也是加密后的密码
    使用bcryptjs 进行密码的加密
6. 状态码
    - 200 ok
    - 201 Created
    - 400 用户操作错误 Bad Request
    - 401 Forbidden 权限
    - 409 Conflict 冲突
    - 500 服务器错误
