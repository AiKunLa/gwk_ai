import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppTest from './component/inputAndoutput/AppTest.jsx';

function App() {
  const [count, setCount] = useState(0)

  return(
    <div>
      <AppTest />
    </div>
  )
}

export default App
