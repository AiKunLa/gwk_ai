
import './App.css'
import Parent from './components/hookTestCom/Parent'
import { DomEnvent } from './components/Memory/DomEnvent'
import { ModalLeak } from './components/Memory/ModalLeak'

function App() {

  return (
    <>
      <Parent />
      <DomEnvent />
      <ModalLeak />
    </>
  )
}

export default App
