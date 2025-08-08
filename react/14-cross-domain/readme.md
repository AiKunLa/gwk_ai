# 大前端

- 大前端 都是基于js的
    - React/Vue MVVM 前端
    - node.js 后端
    - 移动端
        React Native
    - 桌面端 TS
        Electron 
    - 嵌入式 AI

Cross-Origin Resource Sharing
- 如何解决跨域问题
1. 使用script的跨域解决方案 JSONP
    返回JSON 数据
    使用script src 发送一个请求
        - 必须是get请求
        - 返回js
        - 前端要的是JSON数据，还要继续执行
        - 前端埋一个函数
            - 后端返回一个js函数的执行
            - 在执行时将数据传递给函数
    只能解决get请求的跨域问题

    - 手写jsonp
        - srcipt是用来加载静态js的，它加载的是静态数据
        - 后端配合解析 script url ，解析url中的参数，并创建url实例

    - 问题
        由于全局挂载了callback函数，容易被黑客利用

2. cors方案
    浏览器会发送CORS请求，如果服务器设置了Access-Control-Allow-Origin，浏览器就会允许跨域请求
    访问的权利在后端
    - 简单跨域请求
        - 简单请求
            - 方法：GET、HEAD（）、POST
            - 头信息：Accept、Accept-Language、Content-Language、
            Content-Type 
            text/plain 
            multipart/form-data 
            application/x-www-form-urlencoded


        - 预检请求
            在发送真实请求之前，浏览器会先发送预检请求，通过预检请求可以获取服务器允许的请求方法和头信息
            若真实请求符合服务器的要求，则发送真实请求

            - 方法：PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH
            - 头信息：Access-Control-Request-Method、Access-Control-Request-Headers
                METHOD OPTIONS

3. proxy代理


