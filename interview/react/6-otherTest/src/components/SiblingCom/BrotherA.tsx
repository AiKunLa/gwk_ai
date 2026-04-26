import { useState } from 'react'

interface BrotherAProps {
  onMessageChange: (msg: string) => void
}

export function BrotherA({ onMessageChange }: BrotherAProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onMessageChange(input)
      setInput('')
    }
  }

  return (
    <div className="sibling-component">
      <h4>Brother A (Sender)</h4>
      <p>发送消息给 Brother B</p>
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

export default BrotherA
