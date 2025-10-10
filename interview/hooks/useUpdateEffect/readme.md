# useUpdateEffect只在更新的时候执行，挂载的时候不执行

- 使用useRef记录一个boolen值，初始为true，当为true的时候return，组件挂载之后为false

## 能够拿到上一次的状态的值

- usePrevious 能够拿到上一次的状态的值
