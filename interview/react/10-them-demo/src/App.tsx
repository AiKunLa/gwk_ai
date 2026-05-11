import { useState } from 'react'
import './App.css'
import { ThemeInfo, ThemeButton } from './components/AllCompoent.tsx'
import { useTheme } from './hooks/useTheme.ts';

function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme();
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          background: theme.type === 'light' ? '#f9f9f9' : '#121212',
          color: theme.type === 'light' ? '#333' : '#eee',
          fontFamily: 'sans-serif',
          padding: 40,
          transition: 'all 0.3s',
        }}
      >
        <h1>🌗 主题切换 Demo</h1>
        <ThemeButton />
        <ThemeInfo />
        <p style={{ marginTop: 20 }}>刷新页面后主题依然保留 ✅</p>
      </div>
    </>
  )
}

export default App
