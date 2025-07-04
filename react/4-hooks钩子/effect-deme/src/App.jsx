import { useState, useEffect } from "react";

import Timer from "./conpomnet/Timer";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [sum, setSum] = useState(0);
  const [repos,setRepos] = useState([])
  const [isTimerOn,setTimerOn] = useState(false)


  useEffect(() => {
    console.log('无依赖数组effect执行')
  })

  useEffect(() => {
    // 获取数据
    // const gitData = async () => {
    //   const data = await fetch('https://api.github.com/users/AiKunLa/repos')
    //   const res = await data.json()
    //   console.log(res)
    //   setRepos(res)
    // }
    // gitData()
    console.log('空依赖数组effect执行')
  }, []);

  // 监听count
  useEffect(() => {
    console.log('有依赖项effect执行')
    // console.log(`count值为${count}`);
    // document.title = `你点击了${count}次`;
  }, [count]);

  // 监听sum
  // useEffect(() => {
  //   console.log("sum变化了");
  // }, [sum]);

  return (
    <div className="container">

      {/* <ul className="repos">
        {
          // 在jsx中 
          repos.map((item)=>
            // li循环输出时要加key值，
            <li key={item.id}>{item.full_name}</li>
          )
        }
      </ul> */}


      <h1>当前点击了{count}次</h1>
      {/* 点击按钮会触发setCount,setCount会触发组件重新渲染,
      重新渲染会执行useEffect,useEffect会执行副作用操作 */}
      <button onClick={() => setCount(count + 1)}>点击我</button>
      <h1>当前求和为{sum}</h1>
      <button onClick={() => setSum(sum + 1)}>求和</button>
      
        {isTimerOn && <Timer />}
        <button onClick={()=> setTimerOn(!isTimerOn)}>
          {isTimerOn? "关闭定时器":"开启定时器"}
        </button>
    </div>
  );
}

export default App;
