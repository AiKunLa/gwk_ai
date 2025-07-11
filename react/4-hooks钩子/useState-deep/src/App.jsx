import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [title,setTitle] = useState('默认标题')
  const handleClick = () => {
    // useState是异步更新的，若有多次响应更新，则会统一处理。这样是为了避免多次更新导致的性能问题（重绘重排）
    setCount(count + 1);// 用的是闭包的count，拿不到最新的
    setCount(count + 1);
    setCount(count + 1);
    setCount(prev => prev + 1) // 每次拿上的是一个状态，回调函数的参数是上一个状态的值
  }
  return (
    <>
      <p>当前记数:{count}</p>
      <button onClick={handleClick}>+3</button>
    </>
  )
}

export default App