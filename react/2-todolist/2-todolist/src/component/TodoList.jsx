import { useState } from "react"
import TodoForm from "./TodoFrom"   
import Todo from "./Todo"

function TodoList() {
    // 数据驱动的界面
    // 静态页面
    // 由 DOM数组 ——》 map -》 join('') ——》 innerHtml 底层Aip编程
    // 使用上述的用法的缺点在于低效、并且是面向API的
    // 我们需要面向业务，而不是面向API，业务才是王道
    // 数据 ——》变化 ——》 数据状态 ——》 数据驱动界面 ——》 自动刷新页面

    // useState    value f()  解构赋值
    const [todos,setTodos] = useState([ // 第一项是数据变量  第二项是修改数据方法 当数据发生变化时页面会发生变化
        {
            id:1,
            container:'吃饭',
            completed:false
        },
        {
            id:2,
            container:'睡觉',
            completed:true
        }
    ])
    const [title,setTitle] = useState('ToDoList') // 第一项是数据变量  第二项是修改数据方法 当数据发生变化时页面会发生变化

    const  handleAdd = (text) => {
        setTodos([...todos,{id:todos.length + 1,container:text,completed:false}])
    }
    // setTimeout(()=>{
    //     let i = todos.length + 1
    //     setTodos([
    //         ...todos, // ... 是展开运算符  相当于复制一份
    //         {
    //             id:i,
    //             container:Math.random(),
    //             completed:false
    //         }
    //     ])

    //     setTitle('Change Titile')

    // },3000)

    return (
        <div className="continer">
        <h1 className="title">{title}</h1>
        <TodoForm onAdd={handleAdd}/>
        {/* 组件传参 */}
        <Todo todos={todos} setTodos={setTodos} />
        </div>  
    )
  }

export default TodoList