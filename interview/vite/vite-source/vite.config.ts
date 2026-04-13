import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import 'dotenv/config'

import viteImagemin from 'vite-plugin-imagemin'

// 雪碧图，将多次图片请求压缩到一次进行图片请求
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const isProduction = process.env.NODE_ENV === 'production'
const CND_URL = process.env.CND_URL

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(),
  // 图片压缩插件
  viteImagemin({
    // 无损压缩
    optipng: {
      optimizationLevel: 7
    },
    // 有损压缩，
    pngquant: {
      quality: [0.8, 0.9]
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox'
        },
        {
          name: 'removeEmptyAttrs',
          active: false
        }
      ]
    }
  }),

  // 雪碧图插件
  createSvgIconsPlugin({
    iconDirs: [path.join(__dirname, 'src/assets/icons')]
  })

  ],
  resolve: {
    // 别名配置
    alias: {
      "@assets": path.join(__dirname, 'src/assets')
    }
  },
  base: isProduction ? CND_URL : '/',
  build: {
    // 若静态资源小于8kb则使用base64格式将其内联到页面上
    assetsInlineLimit: 8 * 1024
  }
})
