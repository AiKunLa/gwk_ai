# 手写react
- Dideact
    命名空间 namespace
    对象字面量

- JSX react优点
    js里面编写HTML，以及简便的表达UI
    bable 使用React.createElemt
    如何实现createElemte

- App.jsx -> babel -> Dideact.createElement(tag,props,...children)
    返回结果 VDOM
-》 render 生成真正的DOM


## babel 配置
    - 安装bable
        pnpm i @babel/core @babel/cli babel-loader @babel/preset-react -D
        编译命令
            npx babel src/index.jsx -o dist/compiled.js
    - 参数配置，先创建.babelrc文件
        配置要对那个进行转译
            "@babel/preset-react", 表示用于处理react的
        在其中配置，通过那个框架进行 
                Didact是我们自定义的框架
                // 将JSX标签默认转换函数从React.createElement修改为自定义框架Didact的createElement函数
                "pragma":"Didact.createElement", 
                // 将JSX中的Fragment（文档碎片）元素转换为Didact.Fragment组件
                "prgmaFrag":"Didact.Fragment"

## createElement
    返回一个VDOM 虚拟dom，VNode 虚拟节点 包含type，props两个属性，props.children是子节点，也是一个对象

    React.createElement 返回的 Element 就是一个在内存中描述“要在页面上渲染什么”的普通 JavaScript 对象（即虚拟 DOM 节点），它包含 type、props 等属性，是 React 用来对比变化并高效更新真实 DOM 的虚拟表示。

    createTextElement 没有type 没有children，但是还是给他设置了，这是为了统一执行render，

## 手写完成功能
    React is a namespace
    The reacteElement Funtion
    The render Function
    Concurrent Mode 并发模式
        React Concurrent Mode 是一种让渲染过程可中断、可优先级排序的机制，通过将工作拆分为小块并允许高优先级更新（如用户输入）插队，从而避免主线程阻塞，提升应用的响应性和流畅度。
    fiebe 机制 可中断，requeIdoCallback
        fiber节点对象有那些属性