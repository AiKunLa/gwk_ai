import { useEffect,useRef } from "react";

const useUpdateEffect = (effect,deps) => {
    const isMounted = useRef(true)
    useEffect(()=>{
        if(isMounted){
            isMounted.current = false
        }else {
            return effect()
        }   
    },deps)
}
export default useUpdateEffect