import { useState, memo, useCallback, useMemo } from "react";
import "./App.css";

function App() {
  console.log("App组件渲染");
  const [count, setCount] = useState(0);
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);

  // 使用 useMemo 来记忆计算结果
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>App组件计数 {count}</button>
      <button onClick={() => setA(a + 1)}>a++</button>
      <div>{memoizedValue}</div>
    </>
  );
}

function computeExpensiveValue(a, b) {
  console.log("执行computeExpensiveValue ");
  // 模拟一个耗时操作
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += a + b;
  }
  return result;
}

const Button = ({ buttonCount }) => {
  console.log("Button组件渲染");
  return (
    <>
      <button>Button组件计数 {buttonCount}</button>
    </>
  );
};

const ButtonMemo = memo(Button);

export default App;
