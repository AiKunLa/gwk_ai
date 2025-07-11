import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import useCounter from "./hooks/useCounter.js";
import useWindowSize from "./hooks/useWindowSize.js";

function App() {
  const size = useWindowSize();
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        窗口尺寸：{size.width} x {size.height}
      </div>
      {/* <ComponentA />
      <ComponentB /> */}
    </>
  );
}

function ComponentA() {
  const { count, increment } = useCounter();
  return (
    <div>
      <h2>Component A: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

function ComponentB() {
  const { count, increment } = useCounter();
  return (
    <div>
      <h2>Component B: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
export default App;
