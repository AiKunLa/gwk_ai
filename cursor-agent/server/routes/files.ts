import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'

const router = Router()

// Read file
router.get('/read', async (req, res) => {
  try {
    const filePath = req.query.path as string
    if (!filePath) {
      return res.status(400).json({ error: 'Path is required' })
    }

    // Security: prevent directory traversal
    const resolved = path.resolve(filePath)
    const content = await fs.readFile(resolved, 'utf-8')
    res.json({ content })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return res.json({ content: '' })
    }
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to read file'
    })
  }
})

// Create new file
router.post('/create', async (req, res) => {
  try {
    const { filename, content = '' } = req.body
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' })
    }

    const filePath = path.resolve(process.cwd(), filename)

    // Check if file exists
    try {
      await fs.access(filePath)
      return res.status(400).json({ error: 'File already exists' })
    } catch {
      // File doesn't exist, create it
    }

    await fs.writeFile(filePath, content, 'utf-8')
    res.json({ success: true, content })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create file'
    })
  }
})

// Save file
router.post('/save', async (req, res) => {
  try {
    const { path: filePath, content } = req.body
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'Path and content are required' })
    }

    const resolved = path.resolve(filePath)
    await fs.writeFile(resolved, content, 'utf-8')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to save file'
    })
  }
})

// List directory
router.get('/list', async (req, res) => {
  try {
    const dirPath = (req.query.path as string) || '.'
    const resolved = path.resolve(dirPath)

    const entries = await fs.readdir(resolved, { withFileTypes: true })
    const files = entries
      .filter(entry => entry.isFile())
      .map(entry => ({
        name: entry.name,
        path: path.join(resolved, entry.name),
        isDirectory: false
      }))
    const directories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(resolved, entry.name),
        isDirectory: true
      }))

    res.json({ files: [...directories, ...files] })
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to list directory'
    })
  }
})

export default router
