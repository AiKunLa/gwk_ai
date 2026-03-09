import { useEffect, useRef, useState } from "react"

const RefInterval = () => {
    const [count, setCount] = useState(0)
    const lastestCountRef = useRef(count)

    useEffect(() => {
        lastestCountRef.current = count
    }, [count])

    useEffect(() => {
        const timer = setInterval(() => {
            console.log(lastestCountRef.current)
            setCount(pre => pre + 1)
        }, 1000)

        return () => clearInterval(timer);
    }, [])

    return <div>{count}</div>
}

export default RefInterval