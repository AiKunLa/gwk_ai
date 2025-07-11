# 存储
- 前端存储
 - localStorage
 - sessionStorage
 - cookie
    
- 后端存储
 - MySql NoSql 
- 缓存

# node后端
- require是什么
    node有两套模块化方案，
    - CommonJS （早期方案）。使用require() 导入模块，使用 module.exports 或 exports 导出
        ```js
        const moduleA = require('./moduleA');
        ```
    - ES Modules （现代方案）使用 import / export 语法，异步加载机制
        ```js
        import moduleA from './moduleA';
        ``` 
- 这两种方案的对比
    - require 是同步加载，import 是异步加载
    - require 是运行时加载，import 是编译时加载
    - require 可以直接使用，import 必须使用 {}

- 什么是模块化
将大文件拆分成小文件，

- js后缀与mjs后缀的区别
    - js后缀的文件是CommonJS规范的，mjs后缀的文件是ES Modules规范的

    - js后缀的文件不能直接使用import / export 语法，mjs后缀的文件可以直接使用import / export 语法，这与node的版本相关，最新的node版本支持js后缀文件使用import / export语法

    - js后缀的文件不能使用浏览器直接运行，mjs后缀的文件可以使用浏览器直接运行





## 端口
一台设备上有多个端口，每一个端口后面代表的是一个服务（进程），如3306 就是Mysql提供服务的端口
- 进程线程
    - 进程是资源分配的最小单位，拥有独立地址空间，一个进程代表一个应用程序的运行实例
    - 线程是cpu调度的基本单位，共享进程资源

- url = ip（设备） + 端口（服务/进程） + 资源路径

