# 全栈开发
- 前端 react
  mockjs 前端伪接口， 不能等后端将接口开发完才开始
- 后端 java/node/go

## 安装
npm init vite  初始化
pnpm i  相关依赖
pnpm i react-router-dom 安装路由
pnpm i vite-plugin-mock -D 开发阶段

## mock
前端在后端给出真实接口前，需要mock一下，前端自己模仿后端的一个伪接口
- 安装 vite-plugin-mock 插件
- 启动mock服务
- /mock/test.js 根目录
  export default [
    {
      'GET /api/test': {
        code: 200,
        msg: 'success',
        data: {
          name: '张三',
          age: 18
        }
      }
    }
  ]
  导出一个默认数组，每个元素是一个对象
  - 前后端联调
    - 开会立项，确定接口文档 api
    - 前端做前端的，后端做后端的
