import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'

export type LLMProvider = 'openai' | 'anthropic' | 'deepseek'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  provider: LLMProvider
  context?: {
    fileName: string
    fileContent: string
  }
  history?: ChatMessage[]
}

class LLMService {
  private openai: OpenAI | null = null
  private anthropic: Anthropic | null = null

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (openaiKey && openaiKey !== 'your_openai_api_key') {
      this.openai = new OpenAI({ apiKey: openaiKey })
    }

    if (anthropicKey && anthropicKey !== 'your_anthropic_api_key') {
      this.anthropic = new Anthropic({ apiKey: anthropicKey })
    }
  }

  async chat(request: ChatRequest): Promise<string> {
    const { message, provider, context, history = [] } = request

    // Build system prompt with context
    let systemPrompt = 'You are a helpful AI programming assistant.'
    if (context) {
      systemPrompt += `\n\nThe user is currently working on a file called "${context.fileName}".\nIts content:\n\`\`\`\n${context.fileContent}\n\`\`\``
    }

    switch (provider) {
      case 'openai':
        return this.chatWithOpenAI(message, systemPrompt, history)
      case 'anthropic':
        return this.chatWithAnthropic(message, systemPrompt, history)
      case 'deepseek':
        return this.chatWithDeepSeek(message, systemPrompt, history)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private async chatWithOpenAI(message: string, systemPrompt: string, history: ChatMessage[]): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env')
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
      { role: 'user' as const, content: message }
    ]

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || 'No response'
  }

  private async chatWithAnthropic(message: string, systemPrompt: string, history: ChatMessage[]): Promise<string> {
    if (!this.anthropic) {
      throw new Error('Anthropic API key not configured. Set ANTHROPIC_API_KEY in .env')
    }

    const anthropicHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' as const : 'assistant' as const,
      content: h.content
    }))

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        ...anthropicHistory,
        { role: 'user', content: message }
      ]
    })

    return response.content[0]?.type === 'text'
      ? response.content[0].text
      : 'No response'
  }

  private async chatWithDeepSeek(message: string, systemPrompt: string, history: ChatMessage[]): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey || apiKey === 'your_deepseek_api_key') {
      throw new Error('DeepSeek API key not configured. Set DEEPSEEK_API_KEY in .env')
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ]

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0]?.message?.content || 'No response'
  }
}

export const llmService = new LLMService()
