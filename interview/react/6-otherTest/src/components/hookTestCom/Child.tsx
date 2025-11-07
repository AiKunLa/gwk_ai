import { memo } from "react"


const Child = memo((props:any)=>{

    console.log('child render')

    return (
        <>
            Child {props.count}
            <p>
                props.listData.toString()
            </p>
        </>
    )
})

export default Child