import { useState } from 'react'
import { eventBus } from './EventBus'

export function BrotherE() {
  const [input, setInput] = useState('')

  const handlePublish = () => {
    if (input.trim()) {
      eventBus.emit('message', input)
      setInput('')
    }
  }

  return (
    <div className="sibling-component">
      <h4>Brother E (Publisher)</h4>
      <p>通过 EventBus 发布消息</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入消息..."
        style={{ marginRight: '8px' }}
      />
      <button onClick={handlePublish}>发布</button>
    </div>
  )
}

export default BrotherE
