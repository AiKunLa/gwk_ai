# VUE全家桶
使用MVVM架构模式，
包含Vue、Vue Router、Vuex、TypeScript、Vite等
状态管理：zustand pinia


渐进式框架，有着大量官方提供的api

## vue语法

SFC 单文件组件
模板语法
指令
事件
计算属性
响应式


## 项目架构

## 配置

- pnpm i @types/node 用于解决vite中使用@路径别名的问题

- ts 支持 vue文件的识别

- pnpm i vant
- pnpm i @vant/auto-import-resolver unplugin-vue-components -D  // 自动按需导入vant组件
- npm install tailwindcss @tailwindcss/vite

### vite

- alias 别名配置
- 自动加载组件库  不用手动导入组件
    unplugin-vue-components/vite
    @vant/auto-import-resolver
- pnpm i pinia // 状态管理
- pnpm i axios // 网络请求

## 状态管理

- Pinia
    定义状态管理
    use
    defineStore
        - 第一个参数：store的名称
        - 第二个参数：store的配置
    setupStore
    useStore
    引入状态管理
        import { useStore } from '@/store/homeStore'
    toRefs 用于将store中的状态转换为响应式的ref对象，然后就可以使用

## 插槽

- 提升组件的定制性 #action 具名插槽

## typescript 类型

- vue-router 中的 RouterRecordRaw 类型，用于保证配置正确
    其中的 path 和 component 是必填项，
    其他的都是可选项
- vuex 中的 Module 类型

## tailwindcss

- 原子css
- w-[calc(100vw)] 计算宽度
- 自适应
