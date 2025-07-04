import {useState,useEffect} from 'react'
import './index.css'
export default function Timer() {
    const [time,setTime] = useState(0)

    useEffect(()=>{
        console.log('定时器开启')
        const timer = setInterval(() => {
            setTime(prevTime => prevTime+1)
        }, 1000)
        return () => {
            console.log('定时器关闭')
            clearInterval(timer)
        }
    },[])
 

    return (
        <div>
            <h1>当前时间：{time}</h1>
        </div>
    )
}