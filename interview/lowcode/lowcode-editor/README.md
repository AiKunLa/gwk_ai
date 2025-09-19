# 低代码编辑器

使用aisuda低代码编辑器，核心是维护一个json数据，通过alloment split pane布局，用tailwindcss编辑样式，zustand来管理状态
数据结构是一颗树，不复杂，这是低代码的核心

- 物料区
   物料区中放置一些已经设计好的组件，使用antd组件库来设计
   pnpm i react-dnd react-dnd-html5-backend,用于实现拖拽功能的流行库

## 初始化

- 创建项目
  npx create-vite lowcode-editor
- 引入tailwindcss
  pnpm i tailwindcss @tailwindcss/vite
  在vite.config.ts中配置

  ```js
    import tailwind from '@tailwindcss/vite'

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [react(), tailwind()],
    })
  ```

- 引入allotment，用于在前端项目中实现可拖拽布局，用于搭建平台。实现可调整大小的分栏布局
  pnpm i allotment
  将页面分为
  左：物料区域
  中间：编辑区域
  右侧：配置区域

## 开发

1. 模块化开发

- components
  Header
  Material
  EditArea
  Setting

- zustand
  低代码的本质是维护一个状态，也是一个json数据

## typescript

- 交叉类型
  使用 & 交叉类型来实现状态的管理啊

- Record 是 TypeScript 中的一个内置工具类型（Utility Type），用于快速定义一个对象的结构

## 组件库Antd

pnpm i --save-dev antd

## 拖拽功能实现

- pnpm i react-dnd react-dnd-html5-backend,用于实现拖拽功能的流行库，
- 在main.ts中引入

  ```ts
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css'
    import { DndProvider } from 'react-dnd'
    import {HTML5Backend} from 'react-dnd-html5-backend'

    ReactDOM.createRoot(
      document.getElementById('root')! // 非空断言，表示一定在
    ).render(
      <DndProvider backend={HTML5Backend}>
        <App/>
      </DndProvider>
    )

  ```

- 使用拖拽功能
  useDrag是一个hooks当用户拖动这个元素时，useDrag 会管理拖拽状态，并允许你定义拖拽过程中携带的数据和行为。
  简单来说，useDrag 让你能够：
    指定哪个元素可以被拖动。
    定义拖动时“拿起”什么数据。
    监听拖拽过程中的状态变化（如是否正在拖拽）。

  ```js
    const [_, drag] = useDrag({
    //拖拽项的类型
    type:name,
    // 拖拽时携带的数据
    item: {
        type:name
    }
  })
  ```

- Drop 区域（Page、Container）

  - 用 `useDrop` 声明一个可放置区域，并通过真实 DOM ref 连接（避免 TS `ref` 类型报错）：

  ```tsx
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop(() => ({
    accept: Object.keys(componentConfig), // 接受所有注册组件类型
    drop: (item: { type: string }, monitor) => {
      if (monitor.didDrop()) return; // 子节点已处理，阻止冒泡
      const cfg = componentConfig[item.type]
      if (!cfg) return
      addComponent({
        id: Date.now(),
        name: item.type,
        props: { ...cfg.defaultProps },
        parentId: componentId, // 在 Page/Container 上为当前节点 id，实现插入到该容器下
      })
    },
  }))
  drop(ref)
  return <div ref={ref}>{children}</div>
  ```

- 动态渲染

  - 根据 `components` 树 + `componentConfig` 的 `component`、`defaultProps` 动态 `createElement` 渲染：

  ```tsx
  React.createElement(
    config.component,
    { key: node.id, componentId: node.id, ...config.defaultProps, ...node.props },
    renderChildren(node.children)
  )
  ```

- 常见问题与修复
  - “Cannot find name 'DndProvider'”：从 `react-dnd` 正确导入，并安装依赖。
  - `ConnectDragSource/ConnectDropTarget` 不能赋给 `ref`：先创建 DOM ref，再用 `drag(ref)` / `drop(ref)` 连接。
  - 放不进去：确保拖拽项 `type` 与 `accept` 一致，或用 `Object.keys(componentConfig)` 动态接受全部注册类型。
  - 冒泡导致重复添加：在 `drop` 中使用 `monitor.didDrop()` 早返回。

## 面试讲述提纲（项目总结）

### 使用到的技术
- React + TypeScript：组件化与类型安全
- Vite：开发与构建工具
- Tailwind CSS：原子化样式快速构建
- Allotment：三栏可拖拽分割布局
- Zustand：全局状态（组件树/配置）管理
- react-dnd：拖拽/放置实现（HTML5Backend）
- Ant Design：基础 UI 物料（Button 等）

### 架构设计
- 目录分层：
  - `components/`：Header/Material/EditArea/Setting 等基础视图
  - `materials/`：可渲染的业务物料（Page/Container/Button）
  - `store/`：`components.tsx` 维护组件树，`components-config.tsx` 注册组件元数据
  - `hooks/`：自定义 hooks 封装拖拽复用（`useMaterialDrag`、`useDropAddComponent`、`useAcceptTypes`）
- 渲染机制：根据组件树节点的 `name` 到 `componentConfig` 查找真实组件与默认 props，使用 `React.createElement` 递归渲染，向容器型组件传递 `componentId` 支持层级插入。

### 项目亮点
- 拖拽逻辑模块化：
  - `useMaterialDrag(type)` 一行接入物料拖拽
  - `useDropAddComponent(parentId?)` 通用 Drop 容器，自动写入 Zustand 组件树
  - `useAcceptTypes()` 动态接受所有已注册组件类型
- 可扩展的物料注册表：`components-config.tsx` 集中管理组件元数据与默认属性，新物料零侵入接入
- 冒泡控制与类型安全：`monitor.didDrop()` 阻止上层重复处理；通过真实 DOM ref 连接 dnd，解决 TS ref 类型问题
- 纯数据驱动：组件树就是“页面描述”，便于持久化与回放

### 核心功能实现
- 组件树管理（Zustand）：
  - `addComponent/removeComponent/updateComponent`
  - `getComponentById` 递归检索父子关系
- 拖拽到 Page/Container：
  - Drop 时读取拖拽项 `type`，从 `componentConfig` 取默认 props，生成节点并按 `parentId` 写入
  - 支持任意层级容器作为 Drop 区域
- 动态渲染：
  - `renderComponents` 遍历组件树，按 `name` → `componentConfig` → `component` 动态创建元素
  - 传递 `componentId` 给容器型物料以支持继续嵌套 Drop

### 遇到的困难与解决
- DnD ref 类型不匹配（ConnectDrag/ConnectDrop 不能直接赋给 ref）
  - 方案：使用真实 DOM `ref`，再调用 `drag(ref)`/`drop(ref)` 连接
- 放置事件层级重复触发
  - 方案：在 `drop` 中使用 `monitor.didDrop()` 判断，子节点已处理则上层直接返回
- 拖拽类型不匹配导致无法放置
  - 方案：统一拖拽项 `type` 与 `componentConfig` 的 key；或使用 `Object.keys(componentConfig)` 动态 accept 全量类型
- 页面空白/布局不生效
  - 方案：Allotment 容器提供有效高度（flex-1/min-h-0 或外层 100% 高度），Tailwind 插件接入 Vite

### 可继续优化方向
- 选中/对齐/快捷键/撤销重做
- 画布网格与吸附、框选与多选
- 属性面板 Schema 化，物料可配置项自动生表单
- 拖拽插入位置（前后/索引）与排序
- 持久化与导入导出（JSON/Schema）

