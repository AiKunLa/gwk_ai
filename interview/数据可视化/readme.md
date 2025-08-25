# 数据可视化

pnpm i echarts
pnpm i @types/echarts -D

- echarts
    安装echarts是一个数据化可是库，用于交互式可视化

- @types/echarts
    是echarts类型声明文件，单独用于
    是一个包含 ECharts API 类型定义的包，用于在 TypeScript 项目中提供类型检查和代码提示
    
    echarts原生js和类型声明文件是分开的

- react是ts写出来的，所以不需要类型声明文件


## 数据可视化的价值
    echarts 2D
    three.js 3D
    数据可视化
- echarts 流程
    - 安装echarts，@types/echarts
    - init 实例化
        传递给他一个图标的DOM挂载点
        useRef<HTMLDivElement>(null)    useRef是 null|HTMLDivElement联合类型，因为它是一个可变对象
    - setOption(option)
        series

