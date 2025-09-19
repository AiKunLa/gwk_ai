# useInterval Hook 面试讲解

## 问题背景

在 React 中直接使用 `setInterval` 会遇到闭包陷阱问题。组件状态更新后，定时器仍然执行旧的回调函数，无法获取到最新的状态值。

## 问题代码示例

```jsx
// ❌ 问题代码
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 这里 count 永远是 0
    }, 1000);
    return () => clearInterval(id);
  }, []); // 空依赖数组导致闭包问题
}
```

## 解决方案

通过自定义 `useInterval` Hook 来解决闭包陷阱问题：

### 核心思路
- 使用 `useRef` 保存最新的回调函数引用
- 两个 `useEffect` 分别处理回调更新和定时器管理
- 确保定时器始终执行最新的回调函数

### 实现代码

```typescript
import { useEffect, useRef } from "react";

/**
 * 自定义 Hook：实现类似 setInterval 的功能
 * 解决 React 中 setInterval 的闭包陷阱问题
 * 
 * @param callback 要定时执行的函数
 * @param delay 间隔时间（毫秒），为 null 时停止定时器
 */
export const useInterval = (callback: Function, delay: number) => {
  // 使用 ref 保存最新的回调函数引用，避免闭包陷阱
  const saveCallback = useRef<Function | undefined>(undefined);

  // 保存最新的回调函数
  // 每当 callback 变化时，更新 ref 中的引用
  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  // 创建定时器，依赖 delay 变化
  // 当 delay 为 null 时停止定时器
  // 当 delay 变化时，清除旧定时器并创建新的
  useEffect(() => {
    if (delay === null) return;
    
    // 使用 ref 中的最新回调函数，避免闭包问题
    const id = setInterval(() => saveCallback.current?.(), delay);
    
    // 清理函数：组件卸载或 delay 变化时清除定时器
    return () => clearInterval(id);
  }, [delay]);
};
```

## 正确使用示例

```jsx
// ✅ 正确使用
function Counter() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(c => c + 1); // 始终能获取最新状态
  }, 1000);
  
  return <div>{count}</div>;
}
```

## 技术要点详解

### 1. 闭包陷阱的深层原理

#### 什么是闭包陷阱？
闭包陷阱是指函数捕获了创建时的外部变量值，即使外部变量后续发生变化，函数内部仍然使用旧值。

#### React 中的闭包陷阱
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // 永远是 0
      setCount(count + 1); // 永远是 0 + 1 = 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // 空依赖数组
  
  return <div>{count}</div>;
}
```

**执行流程分析**：
1. 组件首次渲染，`count = 0`
2. `useEffect` 执行，创建 `setInterval`
3. 定时器回调函数**捕获了此时的 `count` 值（0）**
4. 1秒后，定时器触发，但回调函数中的 `count` 仍然是 0
5. 即使组件重新渲染，`count` 变为 1，但定时器回调中的 `count` 仍然是 0
6. 结果：`count` 永远在 0 和 1 之间切换

#### 为什么会有闭包陷阱？
- **词法作用域**：JavaScript 函数在定义时就确定了作用域链
- **React 函数组件**：每次渲染都是新的函数执行，但定时器回调函数在第一次渲染时就被"固化"了
- **异步执行**：定时器是异步的，回调函数执行时，组件可能已经重新渲染多次

### 2. 为什么不使用 callback 作为依赖？

#### 问题代码示例
```jsx
// ❌ 错误做法
useEffect(() => {
  const id = setInterval(callback, delay);
  return () => clearInterval(id);
}, [callback]); // 依赖 callback
```

#### 为什么这样有问题？

1. **频繁重建定时器**
   ```jsx
   function App() {
     const [count, setCount] = useState(0);
     
     // 每次渲染都会创建新的函数
     const callback = () => {
       setCount(count + 1);
     };
     
     useInterval(callback, 1000); // callback 每次都不同
   }
   ```

2. **性能问题**
   - 每次 `callback` 变化都会清除旧定时器，创建新定时器
   - 如果 `callback` 频繁变化，会导致定时器不断重启
   - 可能造成定时器执行不连续

3. **不必要的复杂性**
   - 用户通常希望定时器稳定运行
   - 只有 `delay` 变化时才需要重建定时器

#### 正确的依赖设计
```jsx
// ✅ 正确做法
useEffect(() => {
  if (delay === null) return;
  const id = setInterval(() => saveCallback.current?.(), delay);
  return () => clearInterval(id);
}, [delay]); // 只依赖 delay
```

### 3. useRef 解决方案详解

#### useRef 的特性
```jsx
const saveCallback = useRef<Function | undefined>(undefined);
```

1. **持久性**：`useRef` 返回的对象在组件的整个生命周期中保持不变
2. **可变性**：`.current` 属性可以随时修改
3. **不触发重渲染**：修改 `.current` 不会导致组件重新渲染

#### 解决闭包陷阱的机制
```jsx
// 第一个 useEffect：保存最新回调
useEffect(() => {
  saveCallback.current = callback; // 始终保存最新的回调
}, [callback]);

// 第二个 useEffect：使用 ref 中的回调
useEffect(() => {
  if (delay === null) return;
  const id = setInterval(() => {
    saveCallback.current?.(); // 调用最新的回调
  }, delay);
  return () => clearInterval(id);
}, [delay]);
```

#### 执行流程
1. 组件渲染，`callback` 更新
2. 第一个 `useEffect` 执行，更新 `saveCallback.current`
3. 第二个 `useEffect` 中的定时器回调通过 `saveCallback.current` 访问最新回调
4. 即使组件重新渲染，定时器回调仍然能访问到最新的回调函数

### 4. 内存泄漏防护

#### 为什么需要清理？
```jsx
useEffect(() => {
  const id = setInterval(() => {
    // 定时器逻辑
  }, 1000);
  
  // 必须返回清理函数
  return () => clearInterval(id);
}, [delay]);
```

#### 清理时机
1. **组件卸载时**：防止内存泄漏
2. **依赖项变化时**：清除旧定时器，创建新定时器
3. **delay 为 null 时**：停止定时器

#### 内存泄漏示例
```jsx
// ❌ 没有清理函数
useEffect(() => {
  const id = setInterval(() => {
    console.log('定时器运行中...');
  }, 1000);
  // 忘记清理，组件卸载后定时器仍在运行
}, []);

// ✅ 正确清理
useEffect(() => {
  const id = setInterval(() => {
    console.log('定时器运行中...');
  }, 1000);
  
  return () => {
    console.log('清理定时器');
    clearInterval(id);
  };
}, []);
```

### 5. 完整解决方案的优势

1. **解决闭包陷阱**：通过 `useRef` 确保访问最新回调
2. **性能优化**：只在必要时重建定时器
3. **内存安全**：自动清理资源，防止泄漏
4. **API 简洁**：使用方式类似原生 `setInterval`
5. **类型安全**：完整的 TypeScript 支持

## 面试表达要点

1. **问题识别**：能准确识别 React 中 setInterval 的闭包问题
2. **解决思路**：理解 useRef 在解决闭包问题中的作用
3. **实现细节**：掌握 useEffect 依赖数组的设计原则
4. **最佳实践**：了解内存泄漏防护和性能优化
5. **扩展思考**：可以延伸到其他类似问题的解决方案

## 相关知识点

- React Hooks 原理
- 闭包和词法作用域
- 内存泄漏和资源清理
- 函数式编程思想
- 自定义 Hook 设计模式
