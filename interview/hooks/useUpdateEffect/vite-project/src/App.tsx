import { useState } from "react"
import useUpdateEffect from "./hooks/useUpdateEffect"
import usePrevious from "./hooks/usePrevious"
function App() {
  const [count,setCount] = useState<number>(0)
  const previousCount = usePrevious(count)
  useUpdateEffect(()=>{console.log("count",count)},[count])
  return (
    <>
      <button onClick={()=>setCount(count+1)}>count: {count}</button>
      <button onClick={()=>console.log("previousCount",previousCount)}>previousCount: {previousCount}</button>
    </>
  )
}
export default App