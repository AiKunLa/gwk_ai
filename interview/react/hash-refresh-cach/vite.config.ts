import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // === 基本配置 ===
  root: '.',
  publicDir: 'public', // 静态资源目录，不经过打包处理

  // === 构建配置 ===
  build: {
    outDir: 'dist', // 输出目录
    sourcemap: false, // 是否生成 sourcemap（生产环境建议 false）
    minify: 'esbuild', // 压缩方式: esbuild | terser | false
    chunkSizeWarningLimit: 500, // chunk 大小警告阈值（KB）

    rollupOptions: {
      output: {
        // 入口文件命名规则
        // [name] - 入口名称
        // [hash] - 基于内容的哈希
        // [ext] - 文件扩展名
        entryFileNames: 'assets/[name].[hash].js',

        // chunk 文件命名规则（动态导入的模块）
        chunkFileNames: 'assets/[name].[hash].js',

        // 静态资源命名规则（CSS、图片等）
        assetFileNames: 'assets/[name].[hash][extname]',

        // 代码分割配置
        manualChunks: {
          // React 全家桶单独打包
          'vendor-react': ['react', 'react-dom'],
          // 可添加其他第三方库：
          // 'vendor-router': ['react-router-dom'],
          // 'vendor-utils': ['lodash', 'axios', 'dayjs'],
        }
      }
    }
  },

  // === CSS 配置 ===
  css: {
    devSourcemap: true, // 开发环境开启 CSS sourcemap
  },

  // === 开发服务器配置 ===
  server: {
    port: 5173, // 开发服务器端口
    open: true, // 启动时自动打开浏览器
    proxy: {
      // API 代理示例
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // === 预览服务器配置 ===
  preview: {
    port: 4173, // 预览服务器端口
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },

  // === 插件 ===
  plugins: [
    react(), // React HMR 支持
  ],

  // === 路径别名 ===
  resolve: {
    alias: {
      // 使用 @ 指向 src 目录
      '@': resolve(__dirname, 'src'),
      // 其他常用别名：
      // '@components': resolve(__dirname, 'src/components'),
      // '@utils': resolve(__dirname, 'src/utils'),
      // '@hooks': resolve(__dirname, 'src/hooks'),
    }
  },

  // === 环境变量前缀 ===
  // 格式：VITE_xxx
  envPrefix: 'VITE_',

  // === 依赖预构建 ===
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
    ],
    // exclude: [] // 排除预构建的依赖
  },
})
