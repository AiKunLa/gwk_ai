import { useEffect,useRef } from "react";

//return 在渲染时执行，useEffect 在渲染后执行
export default function usePrevious<T>(value:T) :T|undefined{
    const ref = useRef<T>(undefined);
    // 组件渲染完毕或状态发生改变后，更新ref.current为当前的value
    useEffect(()=>{
        ref.current = value
    },[value])

    // 当状态发生改变时，在组件渲染的时候返回ref.current，这时候的ref.current是上一次的value，一开始是undefined
    return ref.current
}