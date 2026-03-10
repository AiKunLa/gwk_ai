import Editor from '@monaco-editor/react'
import type { FileInfo } from '../App'

interface CodeEditorProps {
  file: FileInfo | null
  onChange: (content: string) => void
}

function CodeEditor({ file, onChange }: CodeEditorProps) {
  if (!file) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#858585'
      }}>
        Select a file to edit
      </div>
    )
  }

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const langMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      json: 'json',
      html: 'html',
      css: 'css',
      md: 'markdown',
      sh: 'shell',
      bash: 'shell',
    }
    return langMap[ext || ''] || 'plaintext'
  }

  return (
    <Editor
      height="100%"
      language={getLanguage(file.name)}
      value={file.content}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
      }}
    />
  )
}

export default CodeEditor
