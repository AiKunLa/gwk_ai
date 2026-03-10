import { useState } from 'react'
import type { LLMProvider, FileInfo } from '../App'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  provider: LLMProvider
  onProviderChange: (provider: LLMProvider) => void
  currentFile: FileInfo | null
}

function ChatPanel({ provider, onProviderChange, currentFile }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          provider,
          context: currentFile ? {
            fileName: currentFile.name,
            fileContent: currentFile.content
          } : undefined,
          history: messages
        })
      })

      const data = await response.json()

      if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.error}`
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="model-select">
        <span>Model:</span>
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value as LLMProvider)}
        >
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="deepseek">DeepSeek</option>
        </select>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ color: '#858585', textAlign: 'center', marginTop: 40 }}>
            Start a conversation with AI. Select a model and type your message.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
              {msg.content}
            </pre>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <span>Thinking...</span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to help with your code..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatPanel
