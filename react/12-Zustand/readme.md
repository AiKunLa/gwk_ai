# Zustand 状态管理
- 现代前端开发模式
    - UI组件 + 全局应用状态管理
- 轻巧，hook化的状态管理库
 - count 响应式状态
 - 全局应用管理
    useContext
- 小项目store不需要
- 中大型项目router store需要
    react-router-dom
    zustand 不要混着用
    组件状态收归中央store统一管理

1. 使用 create 函数来创建一个 store。store 是一个包含状态和更新状态的方法的对象。
    ```js
        export const useCounterStore = create((set) => ({
            count:1,
            increase:()=>{
                set((state)=>({count:state.count+1}))
            },
            decrease:()=>{
                set((state)=>({count:state.count-1}))
            }
        }));
    ```
2. <a href={item.html_url} target="_blank" rel="noreferrer">