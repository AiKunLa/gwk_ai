import { useEffect, useState } from "react"

const TestState = () => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prevCount => {
                console.log(prevCount)
                return prevCount + 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return <div>{count}</div>
}

export default TestState

