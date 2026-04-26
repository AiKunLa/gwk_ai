import { useMessage } from './ContextPattern'

export function BrotherD() {
  const { message } = useMessage()

  return (
    <div className="sibling-component">
      <h4>Brother D (Receiver via Context)</h4>
      <p>通过 Context 接收消息</p>
      <div className="message-box">
        {message ? `收到: ${message}` : '等待消息...'}
      </div>
    </div>
  )
}

export default BrotherD
