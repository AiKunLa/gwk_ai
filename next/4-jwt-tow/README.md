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


## 面试总结



### token刷新流程
1. 双令牌设计
    - 访问令牌(Access Token) ：有效期短（1小时），用于日常API请求验证
    - 刷新令牌(Refresh Token) ：有效期长（7天），专用于获取新的访问令牌
2. 完整刷新流程
    - 检查阶段 使用中间件 middleware。
    - 在中间件层面
        若是当前路径是受保护的，那么逻辑如下。
        - 从cookies中获取accesstoken 和 refreshtoken
        - 若两个都无效，则转跳到登录页进行登录
        - 若accesstoken有效，则在请求头中自定义字段,方便后续操作获取用户数据
            ```js
                // 设置自定义请求头，存储用户数据
                const requestHeaders = new Headers(request.headers);
                requestHeaders.set("x-user-id", accessPayload.userId as string);
            ```
        - 若accesstoken无效，refreshtoken有效则重定向到“/api/auth/refresh”，进行tokne刷新
            ```js
                const refreshUrl = new URL("/api/auth/refresh", request.url);
                refreshUrl.searchParams.set("redirect", request.url);
                return NextResponse.redirect(refreshUrl);
            ```


### 大文件上传
当文件比较大的时候，由于各种原因，容易失败，并且上传速度很慢，一旦失败需要从新上传，用户体验不好

- 实现策略
    采用分片上传策略来并发上传（限制并发数量，进行断点续传）
    并行上传，提升稳定性和效率。上传前通过webworker计算文件整体以及分片的hash，向服务器校验，若文件已经存在则直接妙传。
    前端记录上传进度和已经成功分片，支持短点续传，避免重复上传，提高用户体验。
    服务器按序接收分片，存储后进行合并，并检验最终文件的完整性，结合唯一标志和分片索引，确保上传可靠。
    整个过程配合进度条和错误重试机制，提升用户体验和系统健壮性。

- 并发上传原理**难点**
    底层是通过js事件循环机制，本质上不是并发
    1. 核心思想是通过一个任务队列（queue） + 有限的工作线程池（workers）来控制并发。Promise.all + 递归
        queue 是一个简单的数组，但它扮演了任务队列的角色。它**存储了所有需要上传的分片索引**。
        workers 数组存放的是 Promise，每个 Promise 代表一个正在执行的上传任务（即一个“工作线程”）。
    2. 初始化工作池
        ```js
            for(let c = 0; c < Math.min(MAX_CONCURRENCY, queue.length); c++){
                workers.push(next());
            }
        ```
        没有为每一个分片都创建一个上传任务,只创建 Math.min(MAX_CONCURRENCY, queue.length) 个初始任务。
        这样**同时干活的“工人”数量也就被限制在了这个范围内**。
        每个 next() 调用启动一个“工作线程”（实际上是一个异步函数）Promise。
    3.  核心逻辑
        每次 next 执行时，都会从 queue 中 shift() 取出一个分片索引。然后**调用 uploadChunk 上传这个分片**。
        **无论**上传成功还是失败（finally 块确保总会执行），**只要队列中还有任务（queue.length > 0），它就会再次调用自己 next()。**

        也就是说 一个 next 函数（一个工作线程）在完成一个任务后，并不会“死亡”，而是立刻去“领取”下一个任务并执行。





- worker hash 进行计算
- 性能优化
    使用useCallback缓存上传处理文件函数，避免重复创建
- ts的使用
    约定主线程和worker之间的通信格式
    HashWorkerIn，HashWorkerOut
    使用 as 来断言，表示这个对象一定是这个类型
    非空断言，！ 表示这个对象一定有不为空

- es6
    使用Set存储已经上传的分片索引
    使用 ？？ 空值运算符
    使用Promise.all 并发上传
    Map 和 Set
        使用Set来实现大文件切片上传索引不重复

- useRef高级使用
    绑定DOM对象
    保存值或对象
    eg：保存AbortController对象，AbortController 有一定的开销，不应该在组件挂载的时候创建

- restful api
    - uploadChunk 上传分片使用PUT  直接替换片段，因为片段无法修改
    - 自定义请求头 使服务器可以在不解析请求体的情况下快速识别分片归属和顺序，这样更加的快


- 后端
    1. 文件存储
        在文件系统中 ‘a’ 为相对路径 ，"/b" 为相对路径
        - 文件路径拼接 path.join与path.resolve的区别
            **path.join** ：它只是简单地将字符串连接起来，并处理掉多余的斜杠和.
                从左到右，
                ```js
                console.log(path.join('/foo', 'bar', 'baz/asdf')); // 输出: /foo/bar/baz/asdf
                console.log(path.join('/foo', 'bar', '..', 'baz/asdf')); // 输出: /foo/baz/asdf (.. 被解析)
                ```
            **path.resolve**:
                若后面的片段以 / 开头那么就会覆盖掉前面的路径
                ```js
                    console.log(path.resolve('foo/bar', '/tmp/file/')); // 输出: /tmp/file (同上，第二个片段是绝对路径)
                    console.log(path.resolve('foo', 'bar')); // 输出: /home/user/myproject/foo/bar (基于当前工作目录的绝对路径)
                ```

## 文件合并流程
1. 前端传入文件hash值，然后使用ensureUploadDirs来确保文存在，之后读取meta文件获取文件相关信息，如文件名称、分片数量。之后调用mergeChunks进行文件合并
2. 在mergeChunks中，先通过hash获取分片目录，然后创建最终存储的目录，之后创建createWriteStream 文件可写流。
    最后按顺序读取文件（readFileSync）并写入ws.write(data)，全部写入后关闭写入流并返回结果


- EventEmitter
    EventEmitter 是一个类，许多核心模块（如 fs, http, stream 等）都继承自它，从而具备了事件处理能力。
    - 手写EventEmitter



##  虚拟列表
- 数据从哪里来
    通过爬虫爬取
    安装 pnpm i x-crawl
    安装 pnpm i puppeteer 安装Puppeteer所需的Chrome浏览器版本。
        
    - x-crawl 是一个灵活且功能强大的 Node.js 多功能爬虫库，支持页面、接口和文件的抓取，并集成了 AI 辅助功能以智 能应对反爬机制和优化爬取策略。

    - 通过正则来切分数据，
    - node可以通过querySelector来查询数据，并获取。它是通过在内存中构建DOM树来实现的，x-crawl支持这种
    - AI辅助
        用prompt 去描述我们需要的内容，然后AI回去和内存沟通然后获取
    1. Puppeteer 无头浏览器
- 如何渲染列表
    - 时间分片
        setTimeout + requestAnimationFrame + createDocumentFragment
    - 虚拟列表
        按需加载
    - 分页
        滚动加载
        点击分页