import { useState } from "react";
import "./App.css";
import LifecycleDemo from "./components/LifecycleDemo";
import FunctionComponent from "./components/FunctionComponent";
import { useToggle, useRequest } from "ahooks";

function App() {
  const [state, { toggle, set, setLeft, setRight }] = useToggle(false);
  const [count, setCount] = useState(0);
  
  function getUsername() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("张三");
      }, 5000);
    });
  }

  const { run, data, loading } = useRequest(getUsername);

  if (loading) return <div>loading...</div>;
  if (data) return <div>{data}</div>;

  return (
    <>
      <LifecycleDemo />
      <FunctionComponent />
      <div>
        <button onClick={toggle}>切换</button>
        <button onClick={() => setLeft()}>左</button>
        <button onClick={() => setRight()}>右</button>
      </div>
      <div>
        <p>{state ? "左" : "右"}</p>
      </div>
    </>
  );
}

export default App;
