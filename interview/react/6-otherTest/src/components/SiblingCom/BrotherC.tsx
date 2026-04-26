import { useState } from 'react'
import { useMessage } from './ContextPattern'

export function BrotherC() {
  const [input, setInput] = useState('')
  const { sendMessage } = useMessage()

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="sibling-component">
      <h4>Brother C (Sender via Context)</h4>
      <p>通过 Context 发送消息</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入消息..."
        style={{ marginRight: '8px' }}
      />
      <button onClick={handleSend}>发送</button>
    </div>
  )
}

export default BrotherC
