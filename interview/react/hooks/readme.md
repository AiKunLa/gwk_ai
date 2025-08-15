# react中的hooks

- react版本
  react16.8.0 是划时代的更新，函数组件，hooks 2019
  在这之前都是用类组件，Component基类
  在这个时期，函数组件，子组件+父组件通过props传递数据，没有状态组件。使用函数组件类展示UI，这样简单，性能好
  函数组件与useState 和 useEffect 等hooks 就可以达到类组件的效果。这样类组件就没有用了

- 类组件
    类组件的生命周期和状态 ,
    - 类组件比较固首于类的格式，比较繁琐
    - 有this丢失问题，在事件处理时。函数组件没有this丢失问题
    - 一些钩子函数 由useEffect副作用来替代
    - 开销大 函数组件结合memo useMemo，有更好的新能优化
    - vue抄袭了react的hooks
        hooks函数式编程思想 chatolm

1. hooks表达总线
  - hooks是什么：它是将组件中一些可复用的状态逻辑抽离处理，形成一个以use开头的函数
  - react内置的hooks，
    useState：用定义组件的状态
    useEffect：副作用，模拟类组件的生命周期，
    useCallback：缓存函数，避免函数重复创建
    useMemo：缓存值，避免值重复计算
    useContext：跨组件通信，避免props drilling
    useRef：引用，获取DOM元素，避免使用refs，还可以用于创建一个可变的引用对象，还使用Ref.current来存储
    useLayoutEffect：布局副作用，在DOM更新,浏览器绘制之前同步执行，用于提前获取DOM数据，避免页面出现闪烁
    useImperativeHandle：自定义暴露实例方法，用于父组件调用子组件的方法。
    
  - 自定义hooks，useMouse，useTodo，useinerSectionObserver，
  - ahooks
    useToggle 触发器 状态切换， 常用于
    useRequest 网络请求，（请求，）

