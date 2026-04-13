
import './App.css'
import { JsonEXP } from './components/JsonEXP'

import { Header } from './components/Header'

function App() {

  return (
    <>
      <Header />
      <div>
        {
          <JsonEXP />
        }
      </div>
    </>
  )
}

export default App
