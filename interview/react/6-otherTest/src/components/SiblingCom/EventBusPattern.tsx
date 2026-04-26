import { useState, useEffect } from 'react'
import { eventBus } from './EventBus'
import BrotherE from './BrotherE'
import BrotherF from './BrotherF'

// 方式三：发布订阅模式 (EventBus)
// 不相关的组件可以通过事件总线通信，解耦程度最高
export function EventBusPattern() {
  const [receivedMsg, setReceivedMsg] = useState('')

  useEffect(() => {
    // 订阅消息
    const unsubscribe = eventBus.on('message', (msg) => {
      setReceivedMsg(msg as string)
    })
    return unsubscribe
  }, [])

  return (
    <div className="demo-card">
      <h3>方式三：发布订阅模式 (EventBus)</h3>
      <p>使用事件总线实现组件通信，解耦程度最高</p>
      <div className="demo-box">
        <BrotherE />
        <BrotherF />
      </div>
      <div className="message-box" style={{ marginTop: '12px' }}>
        事件总线接收: {receivedMsg || '等待消息...'}
      </div>
    </div>
  )
}

export default EventBusPattern
