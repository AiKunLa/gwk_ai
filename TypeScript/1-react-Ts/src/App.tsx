import './App.css'
import { useState } from 'react'

interface NameEditComponentProps {
  username:string;
  onChange:(event:React.ChangeEvent<HTMLInputElement>) => void;
}

const NameEditComponent: React.FC<NameEditComponentProps> = (props) => {

  return (
    <>
      <label>change</label>
      <input type="text" value={props.username} onChange={props.onChange}/>
    </>
  )

}

function App() {
  const [name,setName] = useState<string>("张三")

  // ChangeEvent 有target 但不一定有value
  const setUsernameState = (event:React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <> 
      <h1>Hello TypeScript</h1>
      <h2>{name}</h2>
      <NameEditComponent username={name} onChange={setUsernameState} />
    </>
  )
}

export default App
