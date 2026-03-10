import { useState } from 'react'
import type { FileInfo } from '../App'

interface FileExplorerProps {
  files: FileInfo[]
  onFileSelect: (file: FileInfo) => void
  onFilesChange: (files: FileInfo[]) => void
  activeFile: FileInfo | null
}

function FileExplorer({ files, onFileSelect, onFilesChange, activeFile }: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return

    try {
      const response = await fetch('/api/files/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: newFileName })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      const newFile: FileInfo = {
        name: newFileName,
        path: newFileName,
        content: data.content || ''
      }

      onFilesChange([...files, newFile])
      onFileSelect(newFile)
      setNewFileName('')
      setShowInput(false)
    } catch (error) {
      // Fallback: create file locally
      const newFile: FileInfo = {
        name: newFileName,
        path: newFileName,
        content: ''
      }
      onFilesChange([...files, newFile])
      onFileSelect(newFile)
      setNewFileName('')
      setShowInput(false)
    }
  }

  const handleOpenFile = async (file: FileInfo) => {
    if (!file.content) {
      try {
        const response = await fetch(`/api/files/read?path=${encodeURIComponent(file.path)}`)
        const data = await response.json()
        if (data.content !== undefined) {
          const updatedFile = { ...file, content: data.content }
          onFilesChange(files.map(f => f.path === file.path ? updatedFile : f))
          onFileSelect(updatedFile)
          return
        }
      } catch {
        // Ignore error, use empty content
      }
    }
    onFileSelect(file)
  }

  return (
    <div className="file-list">
      <div className="file-item" onClick={() => setShowInput(true)} style={{ color: '#4ec9b0' }}>
        + New File
      </div>

      {showInput && (
        <div className="file-item" style={{ flexDirection: 'column', gap: 4 }}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
            placeholder="filename.ts"
            autoFocus
            style={{
              width: '100%',
              padding: '4px 8px',
              background: '#3c3c3c',
              border: '1px solid #0e639c',
              color: '#fff',
              borderRadius: 4
            }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={handleCreateFile}
              style={{
                padding: '4px 8px',
                background: '#0e639c',
                border: 'none',
                color: '#fff',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Create
            </button>
            <button
              onClick={() => setShowInput(false)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid #3c3c3c',
                color: '#ccc',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {files.map((file) => (
        <div
          key={file.path}
          className={`file-item ${activeFile?.path === file.path ? 'active' : ''}`}
          onClick={() => handleOpenFile(file)}
        >
          <span>📄</span>
          <span>{file.name}</span>
        </div>
      ))}
    </div>
  )
}

export default FileExplorer
