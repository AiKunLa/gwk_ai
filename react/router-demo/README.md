# react-router-dom
路由是什么
    前端路由:负责前端页面的导航，他是页面级别组件
    后端路由：负责暴露资源

    传统架构 MVC
        早期只有后端路由
        server-> http请求-> 后端路由-> 响应html页面。 每次切换页面时，都是一个新的请求（以页面返回目的）。 这就是传统后端驱动的web开发
        这种方式前后端紧密集成在一起，耦合严重
        
        MVC Model(代表应用程序的数据和业务逻辑)  View(视图层)  Controller(控制器层，处理业务逻辑)

    前后端分离架构 MVVM  Model（fetch 请求api获取 数据层） View（视图，jsx） ViewModel（VM-视图模型层    useState，将数据绑定到jsx）
        后端路由（接口api）以json格式响应数据
        前端也有了路由：负责页面的切换
            /user/:id path 页面级别组件
        另外通过fetch 后端 api接口来获取数据，从而完成web应用
            PC/Mobile/App/小程序/桌面端 大前端

        前后端联调
            以api开发文档为基础，先开发api接口
            再开发前端页面


        

- 以react开头 
    它是react生态系统的一部分，react负责响应式、状态管理、组件、hooks等核心功能
    那么为什么react-router不是react功能的一部分呢，因为若react什么都做的话，它的体积会很大并变得笨重
    - react-router-dom
    - redux/mobx
    - axios
    react组成成功

## react 开发全家桶
- react 19 只负责状态、组件、hooks等管理
- react-dom 19 负责dom
- react-router-dom 7.6.3  这里的7.6.3分别表示什么（主版本号、次版本号、修订号）




## react 特殊

- 1. 全面组件化
    vue 更注重API react 原生
- 2. 动态路由
    https://juejin.cn/users/123?a=1&b=2#hash
    协议+ip+端口+路径（path）+请求参数+hash
    还有一个id，上述123用户id，params参数

    scheme://username:password@domain:port/path?query_string#fragment
        Scheme：表示使用的协议，如http、https、ftp等。
        Username和Password：用于服务器的身份验证。这部分不是每个URL都必需的，现代实践中出于安全考虑也很少使用。
        Domain：指定网络上服务器的位置，可以是域名（如www.example.com）或IP地址。
        Port：指定连接到服务器时所用的端口号。如果不指定，则使用默认端口（例如HTTP默认为80，HTTPS默认为443）。
        Path：指示请求的具体资源位置。它模拟了文件系统路径的结构。
        Query String：通常以?开始，后面跟随键值对，用于向服务器传递参数。
        Fragment：通常以#开始，用于直接导航至页面内的某个部分，但不会发送给服务器。
    
- 3. restful 国际规范
    url 定义是核心部分
    Method 资源描述
        GET /user/:id 显示用户主页
        GET /post/:id 显示某片文章
        POST /post 创建新文章 提交新文章
        PUT /post/:id 更新文章 更新指定id的文章
        DELETE /post/:id 删除文章 删除指定id的文章

        PUT 替换资源 PATCH 部分更新资源，什么场景下使用
            例如在上传头像的场景下，可以使用PUT /avatar/:id
            在修改文章的场景下，使用PATCH /post/:id
        POST 提交资源
        DELETE 删除资源
        HEAD 与GET类似，只是不返回响应体。查看资源的元信息

        OPTIONS 预检请求。用于检查服务器是否支持特定的HTTP方法和请求头。
        CONNECT 用于隧道连接。
        TRACE 用于调试。


