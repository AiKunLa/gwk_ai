import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import BrotherC from './BrotherC'
import BrotherD from './BrotherD'

// 方式二：Context API
// 创建一个 Context，通过 Provider 提供状态和更新方法
interface MessageContextType {
  message: string
  sendMessage: (msg: string) => void
}

const MessageContext = createContext<MessageContextType | null>(null)

function useMessage() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider')
  }
  return context
}

function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')

  const sendMessage = useCallback((msg: string) => {
    setMessage(msg)
  }, [])

  return (
    <MessageContext.Provider value={{ message, sendMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export function ContextPattern() {
  return (
    <div className="demo-card">
      <h3>方式二：Context API</h3>
      <p>使用 Context 在兄弟组件间共享状态</p>
      <div className="demo-box">
        <MessageProvider>
          <BrotherC />
          <BrotherD />
        </MessageProvider>
      </div>
    </div>
  )
}

export { useMessage }
export default ContextPattern
