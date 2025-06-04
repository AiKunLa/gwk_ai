import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// 函数组件 App组件 组合其他的组件完成应用
// 什么叫做函数组件？ 函数组件就是一个函数，函数的返回值是一个jsx元素
// 函数组件的特点：
// 1. 函数的名称必须以大写字母开头
// 2. 函数的返回值必须是一个jsx元素
// 3. 函数的参数必须是一个对象，不能是一个数组，不能是一个字符串，

// html css js用函数组合再一起，成为一个函数组件
// function App() {
//   const todos = [{name:'熊大',age:18},{name:'熊二',age:16}]
//   return (
//     <>
//     <table>
//       <thead>
//         <tr>
//         <th>姓名</th>
//         <th>年龄</th>
//       </tr>
//       </thead>
//       <tbody>
//         {/* DOM编程
//         react 中使用 {} DOM
//                  */}
//         {todos.map(item => <tr><td>{item.name}</td><td>{item.age}</td></tr>)}
//       </tbody>
//       <tfoot></tfoot>
//     </table>
//      </>
//   )
// }

function App() {
  // 数据 -》 数据状态 数据业务 的转变
  const [todos,setTodos] = useState([{name:'熊大',age:18},{name:'熊二',age:16},{name:'熊三',age:17}])
  const [title,setTitle] = useState('我是标题')
  setTimeout(() => { // 异步操作 数据的改变  数据的更新  数据的重新渲染
    setTodos([{name:'熊四',age:19},{name:'熊五',age:18},{name:'熊六',age:17}])
    setTitle('我是标题2')
  }, 2000)
  return (
    <div>
      <h1 className="title">{title}</h1>
      <table>
        <thead>
          <tr>
            <td>name</td>
            <td>age</td>
          </tr>
        </thead>
        <tbody>
          {
            // html模板
            todos.map(item => <tr>
              <td>{item.name}</td>
              <td>{item.age}</td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}


export default App
