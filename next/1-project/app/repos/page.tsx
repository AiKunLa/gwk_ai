"use client"; // client 编译
import { useEffect, useState } from "react"

export default function ReposPage() {
    const [newTodo,setNewTodo] = useState("")
    const [todos,setTodos] = useState()

    // 添加
    const addTodo = async ()=> {

    }
    // 获取
    const fetchTodos = async () => {
        const response = await fetch('/api/todos')
        const data = await response.json()
        setTodos(data)
    }

    useEffect(()=>{
        
    },[])

    return (
        <main className="container mx-auto p-4 max-w-md ">
            <h1 className="text-2xl font-bold">
                Todos
            </h1>
        </main>
    )
}