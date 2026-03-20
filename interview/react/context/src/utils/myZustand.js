import { useSyncExternalStore } from 'react';
// 注：新版 Zustand 底层已切换为 useSyncExternalStore 以完美支持 Concurrent Mode
// 旧版使用的是 useState + useEffect 手动订阅，原理类似但更繁琐。
// 这里为了演示清晰，我们用经典的手动订阅逻辑模拟其核心思想。

import { useState, useEffect, useRef } from 'react';

/**
 * 迷你版 Zustand create 函数
 * @param {Function} populator - (set, get) => initialState 
 * set: 状态更新函数，用于修改 store 状态
    get: 获取当前状态的函数
    返回值: 初始状态对象


    create 返回一个 useBoundStore 函数，这是自定义 Hook，结构如下：
属性/方法	类型	说明
useBoundStore(selector)	Function	接收 selector，返回状态切片
.setState	Function	直接更新状态
.getState	Function	获取当前全量状态
.subscribe(listener)	Function	订阅状态变化
 */
export const create = (populator) => {
    // 1. 闭包中的私有状态
    let state = null;
    // 2. 监听器集合：Set<ListenerFunction>
    const listeners = new Set();

    // 初始化状态
    const setState = (partial, replace = false) => {
        const nextState = typeof partial === 'function' ? partial(state) : partial;

        // 如果新状态引用没变，直接返回，避免无效通知
        if (!replace && nextState === state) return;

        // 更新状态 (浅合并)
        state = replace ? nextState : { ...state, ...nextState };

        // 🔥 核心：通知所有订阅者
        // 注意：实际生产中这里会有更复杂的批处理逻辑
        listeners.forEach((listener) => listener(state));
    };

    const getState = () => state;

    // 初始化 store
    state = populator(setState, getState);

    // 3. 返回 Hook 函数 (useBoundStore)
    // 这就是我们在组件里调用的 useStore
    const useBoundStore = (selector, equalityFn = Object.is) => {
        if (!selector) throw new Error('You must pass a selector to useStore');

        // 获取当前最新的全量状态
        const currentState = getState();
        // 计算当前组件关心的切片数据
        const currentSlice = selector(currentState);

        // 用于强制更新组件的 dummy state
        const [, forceUpdate] = useState({});

        // 记录上一次的切片值，用于比对
        // 使用 ref 而不是 state，因为我不希望这个值的变化触发渲染
        const lastSliceRef = useRef(currentSlice);

        useEffect(() => {
            // 定义监听器回调
            const listener = (nextState) => {
                const nextSlice = selector(nextState);

                // 🔥 精确比对：只有切片数据真的变了，才触发重渲染
                if (!equalityFn(lastSliceRef.current, nextSlice)) {
                    lastSliceRef.current = nextSlice;
                    forceUpdate({}); // 触发 React 重渲染
                } else {
                    // 如果数据没变，lastSliceRef 也不需要更新，直接忽略
                }
            };

            // 订阅
            listeners.add(listener);

            // 清理函数：组件卸载或依赖变化时取消订阅
            return () => {
                listeners.delete(listener);
            };
        }, [selector, equalityFn]); // 实际实现中 selector 变化处理会更复杂

        return currentSlice;
    };

    // 暴露一些额外方法供非组件环境使用
    useBoundStore.setState = setState;
    useBoundStore.getState = getState;
    useBoundStore.subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return useBoundStore;
};