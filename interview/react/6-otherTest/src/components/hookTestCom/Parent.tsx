import Child from "./Child"
import { useState } from "react" // useState 是 react 中的一个 hook，用于管理状态

export default function Parent(){

    const [count,setCount] = useState<number>(0)

    const [parentCount,setParentCount] = useState<number>(0)

    const [listData,setListData] =  useState<number[]>([])
    

    console.log('parent render')
    return (
        <>
            Parent: {parentCount}
            <Child count={count} listData={listData} />
            <button onClick={()=>setCount(count+1)}>Child+1</button>
            <button onClick={()=>setParentCount(parentCount+1)}>Parent+1</button>

            <button onClick={()=>setListData([1,2,3,4])}>change array</button>
        </>
    )
}