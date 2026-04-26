interface BrotherBProps {
  message: string
}

export function BrotherB({ message }: BrotherBProps) {
  return (
    <div className="sibling-component">
      <h4>Brother B (Receiver)</h4>
      <p>接收来自 Brother A 的消息</p>
      <div className="message-box">
        {message ? `收到: ${message}` : '等待消息...'}
      </div>
    </div>
  )
}

export default BrotherB
