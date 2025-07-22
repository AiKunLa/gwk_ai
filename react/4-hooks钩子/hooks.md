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


## useLayoutEffect
useLayoutEffect 是 React 中的一个 Hook，它的行为与 useEffect 类似，但有一个关键区别：**它会在 DOM 更新之后、浏览器绘制之前同步执行。**
- 这意味着你可以使用 useLayoutEffect 来读取 DOM 布局并同步重新渲染，从而避免视觉上的不一致（例如页面闪烁或布局抖动）。为什么会闪烁,
    当你在 React 应用中直接使用 useEffect 来处理 DOM 测量或布局相关的操作时，可能会出现页面闪烁或布局抖动的问题
        useEffect 在浏览器完成绘制后异步执行
        这意味着 React 先提交渲染结果到屏幕上，然后你的效果代码才运行
        在这之间的短暂时间内，用户可能看到不一致的界面状态
    

- 由于 useLayoutEffect 在 DOM 更新后立即执行，而不是异步执行，所以适用于以下场景：
    需要测量 DOM 元素的尺寸或位置（如高度、宽度、滚动位置等）
    动画的初始设置
    强制同步更新以防止视觉抖动


## useRef

## reducer
- 组件通信
    单项数据流 跨层级
    - 父子组件props通信
    - 子父组件通信-通过自定义事件props传递
    - 兄弟组件通信，通过父组件中转
    全局通信
    - useContext + useReducer
- useContext + useReducer 用于打理复杂的全局跨层级共享

    1. useReducer 全局状态**管理**(useState是响应式状态，只是状态没有管理)。用于管理复杂的状态逻辑
        ```js
            const [state, dispatch] = useReducer(reducer, initialState);
        ```
        **initalState** 初始状态
            ```js
                const initialState = {
                    count: 0,
                    isLogin: false,
                    theme: 'light',
                };
            ```
        **reducer**是一个纯函数，它里面定义了状态改变的规则，根据接收到的动作类型来执行不同的操作（规则），返回新的状态对象
            纯函数：相同的输入会得到相同的输出，不会有副作用，不操作外部变量，不发送请求。
            使用纯函数来管理数据状态，可以规定数据状态的变化规则。使状态变化变得可预测
            ```js
                const reducer = (state,action) => {
                    switch(action.type){
                        case 'increment':
                            return {...state,count:state.count+1}
                        case 'decrement':
                            return {...state,count:state.count-1}
                        default:
                        return state
                    }
                }
            ```
            action 是一个对象，用于描述状态变化的意图。
            每个 action 都有一个 type 属性，用于标识状态变化的类型。
            可以根据 action.type 来判断状态变化的类型，并返回新的状态对象。

        **dispatch** 是一个函数，用于触发状态变化。
            调用 dispatch 并传入 action 对象，会触发 reducer 函数执行，并根据 action.type 来更新状态。
            可以在组件中调用 dispatch 来触发状态变化。
            ```js
                dispatch({type:'increment'})
            ```
    2. 思想
        用意图action代替命令
        用集中化逻辑代替分散的状态更新
        用纯函数代替副作用函数
        
        组件通过调用 dispatch 函数来触发状态变化，而 reducer 函数则根据 action.type 来执行相应的状态更新操作。
        组件可以通过 useReducer 来获取当前状态和 dispatch 函数，从而与状态管理系统进行交互。

            
    
        







## React.memo

- 父子组件渲染顺序
    - 执行的时候由外到内，按组件树来
    - 完成渲染，有局部到全局，由内到外
    若父组件中的状态的改变，而这个状态与子组件无关，但子组件还是会渲染，这样会造成不必要的重绘重排。
- memo 可以解决这个问题，它能帮我们阻止子组件的从新渲染
    memo 用于 记忆一个组件，**只有当它的依赖的状态项（deps）发生变化时，才会重新计算这个值**。
    性能优化
        响应式和性能非常好
        切分组件 热更新
        组件之间独立
        子组件 React.memo
        使用creatContext useContext 将所有状态放到一个地方。若一个状态发生改变，所有使用这些状态的组件都会重新渲染。

## useCallback
- useCallback 是 React 提供的一个 Hook，用于优化性能，**通过记忆函数的引用来避免在每次渲染时都创建新的函数实例**。
    它特别适用于将函数作为 props 传递给子组件的场景，防止因为函数引用变化导致子组件不必要的重新渲染。
    useCallback 用于 记忆一个函数的引用，只有当它的依赖项（deps）发生变化时，才会返回一个新的函数实例。

- 组件划分粒度
    - 组件拆分 单项数据流
    - 负责渲染的组件 （props + js）
    - 除了复用好管理之外，还可以提升性能。应为组件状态发生改变时，组件需要重新渲染，这时候可以使用memo，或useCallback

## useMeom
- useMemo **它通过记忆化计算结果来避免在每次渲染时都进行高开销的重复计算**。它是 React v16.8 引入的。
    useMemo 用于 **记忆一个函数的返回值**，**只有当它的依赖项（deps）发生变化时**，才会重新计算这个值。
    ```js
        const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    ```
