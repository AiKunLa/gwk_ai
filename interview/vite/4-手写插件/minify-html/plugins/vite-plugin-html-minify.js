import path from "path";

function htmlMinifyPlugin() {
  let isBuild = false; // 是否为构建模式
  return {
    // 插件名称，用于在 Vite 中标识该插件
    name: "html-minify",
    // 配置钩子，在 Vite 配置解析完成后执行
    // config: 当前的 Vite 配置对象
    // { command }: 包含当前执行命令的对象，值为 'build' 或 'serve'
    config(config, { command }) {
      // 判断当前是否为构建模式 npm run build
      isBuild = command === "build";
      // 如果不是构建模式（即开发模式），打印提示信息并跳过 HTML 压缩
      if (!isBuild) {
        console.log("[html-minify] 开发模式，跳过HTML压缩");
      }
    },
    // 转换入口 HTML 文件的钩子
    transformIndexHtml: {
      // 设置执行顺序为后置，确保在其他转换之后执行
      order: "post",
      // 异步转换函数，用于处理 HTML 内容
      // html: 原始的 HTML 内容
      // { bundle }: 包含打包结果的对象
      async transform(html, { bundle }) {
        // 如果不是构建模式或者没有打包结果，直接返回原始 HTML
        if (!isBuild || !bundle) return html;
        // 打印正在压缩 HTML 的提示信息
        console.log("[html-minify]正在压缩HTML...");
        // 移除 HTML 中的注释内容，[] 表示范围，\s表示匹配空格  \S表示非空字符  \d表示数字
        const minifiedHtml = html
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/\s+/g, "") // 去除空格
          .replace(/> </g, "><")
          .replace(/^\s+|\s+$/gm, ""); // 去除每一行开始和结尾的空格 g表示全局 m表示多行  i表示忽略大小写
        return minifiedHtml;
      },
    },
    // 写入bundle 构建完成后执行
    writeBundle(options, bundle) {
      const outputDir = options.dir || "dist";
      console.log(
        `[html-minify] HTML 压缩完成，输出到${path.resolve(outputDir)}`
      );
    },
  };
}

export default htmlMinifyPlugin;
