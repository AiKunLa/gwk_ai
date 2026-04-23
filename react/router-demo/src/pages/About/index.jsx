import { useEffect, useState } from "react"

export default function About() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log('About组件被渲染了')
        const interval = setInterval(() => {
            setCount(prevCount => prevCount + 1)
            console.log('About组件的定时器')
        }, 1000)

    }, [])

    return (
        <div>
            <h1>About</h1>
        </div>
    )
}