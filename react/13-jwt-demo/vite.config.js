import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteMockServe({
    mockPath: 'mock',
    localEnabled: true,
  })],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
