/**
 * useInterval 是一个自定义 React Hook，用于在组件中设置基于 setInterval 的定时器，并自动响应最新的 callback。
 * 它的作用类似于 setInterval，但可以自动获取最新的回调函数，且不会因为闭包导致回调拿到老的 state/props。
 *
 * 参数说明：
 * @param callback - 需要定时执行的函数
 * @param delay - 间隔的毫秒数。如果为 null，则不触发定时器
 *
 * 使用解释：
 * 1. 首先用 useRef 创建了一个类似“盒子”的变量 saveCallback，用于保存最新的 callback。
 * 2. 有一个副作用 useEffect，每当 callback 变化时，把它保存到 saveCallback.current。这样保证 interval 每次执行时取到的都是最新的 callback（不会产生闭包陷阱）。
 * 3. 第二个副作用 useEffect 负责根据 delay 来设置 interval，delay 变了会重新设置一次。
 *    - interval 回调执行 tick，每次 tick 都调用 saveCallback.current()，而不是直接用 callback —— 这样即使父组件 callback 变了，interval 也总是拿到最新的 callback。
 *    - 如果 delay 为 null，不会设置 interval。
 *    - 返回一个清除 interval 的操作，确保组件卸载/参数变化时定时器被正确移除，避免内存泄漏。
 *
 * 应用场景：
 * 适用于在 React 组件里周期性执行某个函数（如轮询请求、定时动画），并能保证对 callback、delay 响应式。
 */
import { useEffect, useRef } from "react";

export default function useInterval(callback: Function, delay: number | null) {
  // 用来保存最新的 callback 引用，避免闭包问题
  const saveCallback = useRef<Function>(callback);

  // 保证每次 callback 变化时，更新 ref
  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  // 设置 interval，并在 delay 变动或组件卸载时清除
  useEffect(() => {
    // 为什么要把定时器回调写成一个独立的 tick 函数，而不是直接在 setInterval(() => saveCallback.current(), delay)？
    // 1. tick 作为清晰的逻辑单元，有利于复用和调试，也便于代码结构清楚。
    // 2. 可以在 tick 中做一些额外的检查、扩展（比如增加日志、节流等），不仅限于直接调用 callback。
    // 3. 传统课程/实践中推荐给定名函数给 setInterval，更易于排查错误，也便于 IDE 和调试器识别。
    function tick() {
      // saveCallback.current 里始终存储“最新的”回调函数。
      // 这样定时器每次 tick 都能执行最新的 callback —— 不会因闭包原因拿到过期的逻辑。
      if (saveCallback.current) {
        saveCallback.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      // 组件卸载或 delay 变化时清除定时器
      // 是的，这个返回的清理函数会在以下几种情况调用：
      // 1. 组件卸载时；
      // 2. delay 变化时，React 会先执行上一个 effect 返回的清理函数，再执行新的 effect。
      // 因此每次 delay 变化时，老的 interval 会被清理，新的 interval 会被设置，避免多余定时器叠加。
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useInterval2(callback: Function, delay: number | null) {
  const saveCallback = useRef<Function>(callback);

  // 用于更新回调函数
  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // 执行函数
    function tick() {
      if (saveCallback.current) {
        saveCallback.current();
      }
    }

    // 
    if (delay !== null) {
      // 设置定时器
      const id = setInterval(tick, delay);
      // 当delay发生变化或者组件卸载 执行清除函数
      return () => clearInterval(id);
    }
  }, [delay]);
}

export { useInterval2 };
