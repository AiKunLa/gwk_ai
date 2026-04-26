import { useState } from 'react'
import BrotherA from './BrotherA'
import BrotherB from './BrotherB'

// 方式一：通过父组件作为中间件（Props 传递）
// 父组件持有状态，两个子组件通过 props 接收状态和修改方法
export function ParentPattern() {
  const [message, setMessage] = useState('')

  return (
    <div className="demo-card">
      <h3>方式一：父组件作为中间件</h3>
      <p>状态提升到父组件，子组件通过 props 接收状态和更新方法</p>
      <div className="demo-box">
        <BrotherA onMessageChange={setMessage} />
        <BrotherB message={message} />
      </div>
    </div>
  )
}

export default ParentPattern
