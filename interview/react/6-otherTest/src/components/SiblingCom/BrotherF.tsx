import { useState, useEffect } from 'react'
import { eventBus } from './EventBus'

export function BrotherF() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const unsubscribe = eventBus.on('message', (msg) => {
      setMessage(msg as string)
    })
    return unsubscribe
  }, [])

  return (
    <div className="sibling-component">
      <h4>Brother F (Subscriber)</h4>
      <p>订阅 EventBus 消息</p>
      <div className="message-box">
        {message ? `收到: ${message}` : '等待消息...'}
      </div>
    </div>
  )
}

export default BrotherF
