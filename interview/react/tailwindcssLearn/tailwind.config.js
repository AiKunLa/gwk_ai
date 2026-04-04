/** @type {import('tailwindcss').Config} */
export default {
  // 1. 内容路径配置 (Content)
  // 告诉 Tailwind 扫描哪些文件以生成所需的 CSS 类。
  // 根据你的项目结构调整这些路径。
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}",
    "./public/index.html",
    "./app/**/*.{js,jsx,ts,tsx}", // Next.js 常用
    "./components/**/*.{js,jsx,ts,tsx,vue}",
    "./pages/**/*.{js,jsx,ts,tsx,vue}",
  ],

  // 2. 主题配置 (Theme)
  // 在这里扩展或覆盖默认的 Tailwind 设计系统。
  theme: {
    // extend 对象用于添加新的值，同时保留默认值
    extend: {
      colors: {
        // 添加自定义品牌色
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // 主色调
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        secondary: '#64748b',
      },
      fontFamily: {
        // 添加自定义字体栈
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        // 添加自定义间距
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
    // 如果不使用 extend，直接在这里定义会完全覆盖默认值
    // screens: { ... }, 
  },

  // 3. 插件 (Plugins)
  // 引入官方或社区插件，如 @tailwindcss/forms, @tailwindcss/typography 等
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],

  // 4. 重要选项 (Important)
  // 如果需要在与其他 CSS 框架混用时提高优先级，可以设为 true 或选择器字符串
  // important: true, 
  // important: '#app',

  // 5. 前缀 (Prefix)
  // 如果需要在遗留项目中避免类名冲突，可以添加前缀
  // prefix: 'tw-',

  // 6. 变体配置 (Variants)
  // Tailwind v3+ 通常自动处理，但在某些特殊场景下可能需要手动配置
  // variants: { extend: {} },

  // 7. 安全列表 (SafeList)
  // 强制生成某些类，即使它们没有在 content 文件中被扫描到（常用于动态类名）
  // safelist: ['text-primary-500', 'bg-primary-500'],
}

