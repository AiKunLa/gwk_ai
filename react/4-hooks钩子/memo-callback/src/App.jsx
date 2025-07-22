import { useState, memo, useCallback, useMemo } from "react";
import "./App.css";
import { useEffect } from "react";

const computeExpensiveValue = (num) => {
  for (let i = 0; i < 1000000; i++) {
    num += i;
  }
  console.log("computeExpensiveValue_DO");
  return num;
};

function App() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);
  console.log("App counter");
  useEffect(() => {
    console.log("App useEffect", count);
  });

  let res = useMemo(() => computeExpensiveValue(num), [num]);
  console.log(res);
  
  // const memoizedValue = useMemo(() => computeExpensiveValue(num), [num]);

  // 当夫组件的状态发生改变时，这个函数被重新声明。
  // 那么就可以使用useCallback来记忆这个函数。

  const handleClick = useCallback(() => {
    setNum(num + 1);
  }, [num]);

  return (
    <>
      <div>
        <h2>当前计数：{count}</h2>
        <button onClick={() => setCount(count + 1)}>增加计数</button>
        <MemoButton num={num} handleClick={handleClick} />
      </div>
    </>
  );
}

const Button = ({ num }) => {
  console.log("Button counter");
  useEffect(() => {
    console.log("Button useEffect");
  }, []);
  return <button>增加计数</button>;
};

const MemoButton = memo(Button);

export default App;
