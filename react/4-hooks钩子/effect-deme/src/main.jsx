import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // 严格模式 渲染一次测试一次
  // <StrictMode>
    <App />
  // </StrictMode>,
)
