import { useState } from 'react'
import { useInterval } from './hooks/useInterval'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState<number | null>(null)

  // Hook 必须在组件顶层调用
  useInterval(() => setCount(c => c + 1), delay)

  const handleStart = () => {
    setDelay(1000) // 通过状态控制定时器
  }

  const handleStop = () => {
    setDelay(null) // 停止定时器
  }
  
  return (
    <>
      <div>
        <p>count: {count}</p>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
      <button onClick={handleStart}>start</button>
      <button onClick={handleStop}>stop</button>
    </>
  )
}

export default App
