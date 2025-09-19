import { useEffect, useRef } from "react";

/**
 * 自定义 Hook：实现类似 setInterval 的功能
 * 解决 React 中 setInterval 的闭包陷阱问题
 * 
 * @param callback 要定时执行的函数
 * @param delay 间隔时间（毫秒），为 null 时停止定时器
 */
export const useInterval = (callback: Function, delay: number|null) => {
  // 使用 ref 保存最新的回调函数引用，避免闭包陷阱
  const saveCallback = useRef<Function | undefined>(undefined);

  // 保存最新的回调函数
  // 每当 callback 变化时，更新 ref 中的引用
  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  // 创建定时器，依赖 delay 变化
  // 当 delay 为 null 时停止定时器
  // 当 delay 变化时，清除旧定时器并创建新的，不能依赖于callback，因为callback会变化
  useEffect(() => {
    if (delay === null) return;
    
    // 使用 ref 中的最新回调函数，避免闭包问题
    const id = setInterval(() => saveCallback.current?.(), delay);
    
    // 清理函数：组件卸载或 delay 变化时清除定时器
    return () => clearInterval(id);
  }, [delay]);
};
