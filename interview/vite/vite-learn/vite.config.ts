import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  // root: path.join(__dirname, 'src'),
  plugins: [react({
    babel: {
      plugins: [
        "babel-plugin-styled-components"
        "@emotion/babel-plugin"
      ]
    },
    jsxImportSource:"@emotion/react"
  })],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/variable.scss" as *;`,
        // 如果路径别名 @ 未配置，也可以用相对路径，如：
        // additionalData: `@use "./src/styles/variables.scss" as *;`,
      },
    },
    modules: {
      // name为文件名 local为类名 然后加一个hash名
      generateScopedName: "[name]__[local]__[hash:base64:5]"
    },

    postcss: {
      //这个插件主要用来自动为不同的目标浏览器添加样式前缀，
      // 解决的是浏览器兼容性的问题。
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
