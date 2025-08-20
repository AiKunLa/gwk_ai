# next 配置及概念
- 创建项目npx create-next-app@latest "项目名称"
- 安装 shadn/ui ui组件 npx shadcn-ui@latest init
- npx shadcn@latest init 选择 neutral
- npx shadcn@latest add button input card   我需要什么组件我就去安装


npx 是node自带的，用于
1. yes no yes yes yes

基于create-next-app 创建了一个my-todo next.js项目
- npx 不用先安装项目部署的环境，若没有这个环境会先自动去安装，但是它是临时的，项目卸载之后会删除，不会留下痕迹影响全局环境的配置

- CSR and SSR
    csr 表示组件在客户端运行，组件的编译和挂载都是在浏览器中，SPA，这个谈不上SEO
    next.js 是服务端渲染，组件的编译和渲染都是在服务端，SSR，这种的SEO非常好。这是应为爬虫返回的是服务器端的html，而csr只有一个root，并在root里面挂载组件
    如果要做企业站，SEO
    web app 体验好

- SSR
    组件在服务端渲染，SEO新能很好
    Web Site 
    AI Web Site 在Goole/Baidu 要打榜，AI出厂

- shadn/ui
    - react-vant 组件库安装完后项目就慢了
        需要按需加载 和路由懒加载一样 
    - shadcn-ui的话是之间懒加载
        base color 主题风格
    - 所用的组件是要按需安装的，需要什么组件就安装什么组件
        init 

RESTful 是一种基于 HTTP 协议设计的软件架构风格，后端通过定义资源的 URI，利用 HTTP 动词（如 GET、POST、PUT、DELETE）对资源进行操作，实现前后端分离和接口的统一化管理。

## nextjs特性
    - app 
        可以不需要src
        app 应用目录
        - 目录即为路由
            AppRouter
            repos/page.tsx