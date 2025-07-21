import { useState } from 'react'
import './App.css'
// import 不仅会将其组件导入，还会执行该组件
import Button from './components/Button'
import AutoButton from './components/AutoButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button></Button>
      <AutoButton></AutoButton>
    </>
  )
}

export default App
