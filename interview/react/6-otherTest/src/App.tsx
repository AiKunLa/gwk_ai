
import './App.css'
import SiblingCommunication from './components/SiblingCom'
import Parent from './components/hookTestCom/Parent'
import { DomEnvent } from './components/Memory/DomEnvent'
import { ModalLeak } from './components/Memory/ModalLeak'

function App() {

  return (
    <>
      <SiblingCommunication />
      <Parent />
      <DomEnvent />
      <ModalLeak />
    </>
  )
}

export default App
