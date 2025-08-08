# tailwindcss 原子css

- 这是一个css库，AI生成代码css用的都是tailwindcss

## 配置
- 安装tailwindcss
  pnpm i tailwindcss @tailwindcss/vite @tailwindcss/postcss7-compat postcss@^7
- 配置插件
  - 配置vite插件
    ```js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from 'tailwindcss/vite'
    // https://vite.dev/config/
    export default defineConfig({
      plugins: [
        react(),
        tailwindcss(),
      ],
    })
    ```
- 在index.css中引入
    @import 'tailwindcss'

## 各种内置的css类名
-  一个单位代表 0.25rem  而1rem为16px

## 矢量图
{/* 矢量图 支持无限的放大 不会模糊 区别于橡树图 */}
- 矢量图的优势
  - 矢量图是基于数学公式的，所以可以无限的放大而不会模糊
  - 矢量图的文件大小比较小，所以加载速度比较快


## 文字的行数限制

-webkit-line-clamp 用于限制文字的行数
- 注意：这个属性只能用于块级元素
但是其不能单独使用，需要和其他属性一起使用
webkit表示的是浏览器内核 Chrome + safari
mozilla 表示对mozilla浏览器的支持
带上webkit表示的是如果浏览器是webkit内核的浏览器才会生效，不是webkit内核的浏览器不会生效
- 例如：
  ```css
  .line-clamp-1 {
    overflow: hidden;
    /* -webkit-box  是早期WebKit浏览器实现的弹性盒子模型，用于创建一个垂直排列的弹性容器*/
    display: -webkit-box;
    /* 限制只显示1行文本，超出部分会被截断并显示省略号 */
    -webkit-line-clamp: 1;
    /* vertical 表示行的方向是垂直方向 */
    -webkit-box-orient: vertical;
  }
  ```

