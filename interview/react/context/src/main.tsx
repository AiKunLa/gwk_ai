import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingProvider } from './context/useSettingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingProvider>
      <App />
    </SettingProvider>
  </StrictMode>,
)
