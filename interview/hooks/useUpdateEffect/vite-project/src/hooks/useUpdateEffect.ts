import { useEffect, useRef } from "react";

export default function useUpdateEffect(effect:React.EffectCallback,deps:React.DependencyList){
    const isFirst = useRef(true)
    useEffect(()=>{
        // 若是组件第一次挂载，则不执行
        if(isFirst.current){
            isFirst.current=false
            return
        }
        // 若是组件更新，则执行
        return effect()
    },deps)
}