# hooks
use
函数
响应式状态和生命周期
很好用

- useState
    - 函数式编程
    - 函数式一等对象
    - 函数式类
    - 函数是组件

## 组件的生命周期 lifecyle
1. 挂载阶段（Mounting）
    - 组件初始化
    - 执行组件函数体代码
    - 渲染组件
    ```js
        // 只会在组件挂载时执行一次 其他的useEffect也会执行
        useEffect(() => {
            return () => {
                // 这里可以加载数据
            }
        },[]) // 空依赖数组

        useEffect(() => {
            // 每次渲染后都会执行(包括首次)
        });
    ```
2. 更新阶段 （updating）
    - 执行组件函数体代码
    - 组件重新渲染
    ```js

        // 当依赖项发生改变时执行 首次挂载时也会执行
        useEffect(() => {
            return () => {

            }
        },[count]) // 有依赖数组
    ```

3. 卸载阶段（Unmounting）
    - 组件从DOM中移除
        组件卸载时执行清理操作（如果不清理会造成内存泄漏）
    - 执行清理操作（如定时器、事件监听器等）
    ```js
        // 当前组件卸载时执行
        useEffect(() => {
            // 开启定时器
            const timer = setInterval(() => {
                setTime(prevTime => prevTime+1)
            }, 1000)

            // 关闭定时器 组件卸载时执行
            return () => {
                clearInterval(timer)
                // 这里可以卸载数据(如关闭定时器)
            }
        },[])
    ```


## useEffect
useEffect是React中提供的钩子函数之一,它允许组件在渲染后执行副作用操作，也叫做生命周期函数
jsx函数执行——》组件模板编译——》挂载组件到root——》组件渲染/更新——》useEffect执行
1. 作用:
    - 组件渲染后执行(也就是副作用)
    - 可以在组件渲染后执行副作用操作,（组件第一次渲染所有的useEffect会执行）
    - 监听特定值的变化（需要指定参数（也是依赖），可以有多个）,并在值变化时执行副作用操作，这是因为每次数据变换都会导致组件重新渲染,监听特定值并执行useEffect（这时候只有特点值发生改变时才会执行）

        ```js
        useEffect(() => {
            // 副作用操作
        },[count])
        ```
    - 组件卸载时清理
        - 若发起请求后响应式数据、DOM都不在了，这是后请求也需要取消，就可以通过useEffect的返回值来清理
         - 组件从DOM中移除
            组件卸载时执行清理操作（如果不清理会造成内存泄漏）
        - 执行清理操作（如定时器、事件监听器等）
        ```js
            // 当前组件卸载时执行
            useEffect(() => {
                // 开启定时器
                const timer = setInterval(() => {
                    setTime(prevTime => prevTime+1)
                }, 1000)

                // 关闭定时器 组件卸载时执行
                return () => {
                    clearInterval(timer)
                    // 这里可以卸载数据(如关闭定时器)
                }
            },[])
        ```

2. 为什么useEffect 的回调函数不能直接使用async，而在回调函数内部可以使用async
 

## 组件在什么时候请求接口
- 组件第一时间渲染是最重要的，渲染后使用useEffect去请求结构，这样会避开与组件争抢
- 

## useContext
1. 是什么，有什么用
    在react中，若组件层次太深。那么需要一层层的去传递数据
    useContext主要用于解决组件间状态共享问题，它可以替代 props 逐层传递，通过 Context.Provider 提供全局状态

2. 怎么用
    使用useContext创建一个上下文对象，在需要共享状态的组件中使用Context.Provider包裹子组件，子组件可以通过useContext来获取状态
    
    1. 创建上下文对象
        ```js
        import { createContext } from "react";

        export const ThemeContext = createContext({
        theme: "light",
        toggleTheme: () => {},
        });
        ```
    2. 提供上下文值
        ```js
        // 提供上下文值
        <ThemeContext.Provider value="dark">
            <Child />
        </ThemeContext.Provider>
        ```
    3. 使用上下文对象
        ```js
        // Child使用上下文对象
        import { useContext } from "react";
        import { ThemeContext } from "./context";
        const theme = useContext(ThemeContext);
        ```

    4. 子组件获取上下文值
        ```js
        // 子组件获取上下文值
        const theme = useContext(ThemeContext);
    
## useState
1. 介绍useState
    useState是react内置的hook，它可以用于在函数组件中添加状态（state）。
    useState返回一个数组，数组的第一个元素是当前状态的值，第二个元素是一个函数，用于更新状态的值。

2. useState是同步的还是异步的
    useState是异步更新的，若有多次响应更新，则会统一处理。这样是为了避免多次更新导致的性能问题（重绘重排）
    JSv8引擎 渲染引擎，每次渲染，v8都需要通知渲染引擎，渲染引擎收到通知后，会重新渲染页面，在这个过程中通信会消耗性能。
    指是异步，但执行是同步