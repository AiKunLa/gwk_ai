import { Router } from 'express'
import { llmService } from '../services/llm.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { message, provider, context, history } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' })
    }

    const response = await llmService.chat({
      message,
      provider,
      context,
      history
    })

    res.json({ message: response })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
