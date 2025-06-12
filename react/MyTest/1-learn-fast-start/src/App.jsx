import { useState } from 'react'
import './App.css'
import TestComponent from './component/TestComponent'
import ShoppingComponent from './component/ShoppingComponent'
import ButtonComponent  from './component/ButtonComponent'
import JinZiQi from './component/JinZiQiComponent'
function App() {

  const [count, setCount] = useState(0);
  function handleClick(){
    setCount(count + 1)
  }
  return (
    <div>
      <TestComponent/>
      <ShoppingComponent/>
      <div>Total click {count}</div>
      <ButtonComponent count={count} onClick={handleClick}/>
      <ButtonComponent count={count} onClick={handleClick}/>
      <JinZiQi/>
    </div>
  )
}

export default App
