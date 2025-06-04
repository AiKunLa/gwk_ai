# react 业务

以前是以 DOM 编程的形式
现在：将数据通过挂载点的形式输出到页面上，这个过程交给了框架，框架会自动将数据和页面进行绑定，当数据发生变化时，框架会自动更新页面。
这样可以：专注于业务，远离 AIP 循环输出 tr

## 历史
前端切图仔（html，css + 一点 js）=》前端开发工程师 js =》框架 =》 全栈开发 node+数据库 =》react native（开发安卓和IOS） Android ios -》AIGC AI引用 -》 全干工程师
Web应用（www.baidu.com） 移动应用（Android，IOS）  后端 Node（server）
理清前端发展历程（），对前端开发需要的知识技术有一个整体的了解，并对未来前端发展趋势有一个清晰的认知 。未来AICoding  vibecode 是趋势

## 搭建
1. npm init vite 初始化项目 初始化react vue 等项目的模板和工程
2. 选择 react 或 vue 或其他模板 选择语言
3. 进入项目目录，安装依赖 npm install
4. 启动项目 npm run dev


npm install 安装依赖
npm run dev 启动项目
npm run dev 打包项目

### 为什么要这样做？
通过工程化的方式，我们可以将项目的依赖、配置、脚本等都集中管理，这样可以提高开发效率，减少错误。
通过上述的命令我们创建了一个项目的模板，有了这个轮子，我们就可以快速的创建项目，不需要从零开始。 之和便可以面向业务开发


### npm是什么？
node 包管理工具 用于安装react，npm 是 node 的包管理工具，用于管理 node 包。

## 响应式业务
## TODOS 任务列表
- 数据[]
- 


## react 初步
- react中组件是完成开发任务的最小单元
- 组件是一个函数，返回一个html结构
- 函数体里面 在return 返回数据之前可以申请数据和处理业务逻辑
- 使用{} js表达式，就可以达成数据和页面的绑定，从而不用DMO编程

## 响应式数据 
- 由于数据随时可能发生改变（数据状态 state）
- [todo,setTodos] = useState(初始值)  useState 是react提供的一个钩子函数，用于创建响应式数据。返回一个数组，第一个是数据元素，第二个是更新数据的函数。
- 若要改变数据，直接调用setTodos即可。
