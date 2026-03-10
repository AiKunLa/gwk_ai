import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import ChatPanel from './components/ChatPanel'
import FileExplorer from './components/FileExplorer'

export type LLMProvider = 'openai' | 'anthropic' | 'deepseek'

export interface FileInfo {
  name: string
  path: string
  content: string
}

function App() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [activeFile, setActiveFile] = useState<FileInfo | null>(null)
  const [provider, setProvider] = useState<LLMProvider>('openai')

  const handleFileSelect = (file: FileInfo) => {
    setActiveFile(file)
  }

  const handleContentChange = (content: string) => {
    if (activeFile) {
      setFiles(files.map(f =>
        f.path === activeFile.path ? { ...f, content } : f
      ))
      setActiveFile({ ...activeFile, content })
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Cursor Agent</h1>
        </div>
        <FileExplorer
          files={files}
          onFileSelect={handleFileSelect}
          onFilesChange={setFiles}
          activeFile={activeFile}
        />
      </aside>
      <main className="main-content">
        <div className="editor-container">
          <CodeEditor
            file={activeFile}
            onChange={handleContentChange}
          />
        </div>
        <ChatPanel
          provider={provider}
          onProviderChange={setProvider}
          currentFile={activeFile}
        />
      </main>
    </div>
  )
}

export default App
