import { useState } from "react"

function TodoForm(props) {
    const onAdd = props.onAdd
    const [text,setText] = useState('Over') // 第一项是数据变量  第二项是修改数据方法 当数据发生变化时页面会发生变化
    const [text2,setText2] = useState('Start') // 第一项是数据变量  第二项是修改数据方法 当数据发生变化时页面会发生变化
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(props)
        console.log(e.target[0].value)
        onAdd(e.target[0].value)
    }
    const handleChange = (e) => {
        setText(e.target.value)
        setText2(e.target.value)
    }
    return (      
        <form action="http://www.baidu.com" onSubmit={handleSubmit}>
            <input type="text" placeholder="请输入" value={text} onChange={handleChange}/>
            {/* <input type="text" placeholder="请输入" value{} onChange= {handleChange} /> */}
            <button type="submit">添加</button>
        </form>
    )
  }

export default TodoForm