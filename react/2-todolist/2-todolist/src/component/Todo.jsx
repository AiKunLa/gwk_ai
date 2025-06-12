
function Todo(props) {
    // 如何获取父组件中的数据
    const todos = props.todos // 解构赋值
    console.log(props) //父子组件传参
    return (
        <ul>
            {
                todos.map((item)=> { // 数据驱动界面  数据变化界面会变化
                    return (
                        <li key={item.id}>{item.container}</li> // 数据驱动界面  数据变化界面会变化
                    )
                })
            }
        </ul>
    )
  }

export default Todo