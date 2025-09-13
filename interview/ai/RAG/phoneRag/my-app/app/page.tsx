"use client" // 表示这个组件是客户端组件

import { useChat } from '@ai-sdk/react'
import ChatOutput from '@/components/ChatOutput'
import ChatInput from '@/components/ChatInput'

export default function Home() {
  // chat 聊天功能
  const {
    // 消息列表
    messages,
    // 输入框的值
    input,
    // 状态
    status,
    // 输入框的变化事件
    handleInputChange,
    // 提交事件 向后端发送请求 它会自动调用 /api/chat 路径进行AI对话
    handleSubmit  
  } = useChat()
  return (  
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">PhoneGPT</h1>
      <div className="space-y-4 mb-4 max-h-[80vh] overflow-y-auto">
        <ChatOutput messages={messages} status={status}/>
      </div>
      <ChatInput input={input} 
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </main>
  );
}