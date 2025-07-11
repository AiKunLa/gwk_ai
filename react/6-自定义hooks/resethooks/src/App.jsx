import { useState } from 'react'
import Todos from './components/Todos'
import './App.css'

function App() {
  // 
  const [count, setCount] = useState(0)
  
  return (
   <>
    {/* 开发任务的单位是一个组件 */}
    <Todos />
   </>
  )
}

export default App
