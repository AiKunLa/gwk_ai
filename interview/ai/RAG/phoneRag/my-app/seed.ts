import { config } from "./lib/config";
import { generateEmbedding } from "./lib/embeddingService";
import { supabase } from "./lib/supabase";

//  langchain loader 是RAG的基础功能 可以加载各种功能
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
// supabase 去做向量化的知识数据库
// 文本分割
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

console.log("向量化知识库");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // 每块的长度  其中包含一个比较独立的语意
  chunkOverlap: 100, // 每块之间的重叠长度  重叠的部分可以用来连接两块内容 避免一句话被切断，提升容错率
});

// 定义一个异步函数 scrapePage，该函数接收一个字符串类型的 URL 参数，返回一个 Promise，解析结果为字符串类型
// 此函数的作用是使用 PuppeteerWebBaseLoader 从指定 URL 抓取网页的 HTML 内容
const scrapePage = async (url: string): Promise<string> => {
  // 创建一个 PuppeteerWebBaseLoader 实例，用于加载指定 URL 的网页内容
  const loader = new PuppeteerWebBaseLoader(url, {
    // 配置 Puppeteer 的启动选项，设置为无头模式（即不显示浏览器界面）
    launchOptions: {
      headless: true,
      // 浏览器路径
      executablePath: config.chromePath,
    },
    // 配置页面跳转选项，等待网络空闲后再继续执行后续操作
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    // 定义一个异步评估函数，用于在页面加载完成后执行操作
    evaluate: async (page, browser) => {
      // 在页面上下文中执行代码，获取页面 body 元素的 HTML 内容
      const result = await page.evaluate(() => document.body.innerHTML);
      // 关闭浏览器实例
      await browser.close();
      // 返回获取到的 HTML 内容
      return result;
    },
  });
  // 调用 loader 的 scrape 方法执行网页抓取操作，并返回抓取结果,
  // 移除所有HTML标签，只保留纯文本内容。
  // 以< 开始 [^>] 表示匹配除了>以外的任意字符
  // 以> 结束
  return (await loader.scrape()).replace(/<[^>]*>?/gm, "");
};

//
const loadData = async (webpages: string[]) => {
  // 输入验证
  if (!Array.isArray(webpages) || webpages.length === 0) {
    console.warn("No webpages provided for processing.");
    return;
  }

  console.log(`Starting to process ${webpages.length} webpages...`);

  for (const url of webpages) {
    // 抓取网页内容
    const content = await scrapePage(url);
    // 文本分割
    const chunks = await splitter.splitText(content);

    // 向量化 并插入数据库
    for (let chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      const { error } = await supabase.from("chunks").insert({
        content: chunk,
        vector: embedding,
        url: url,
      });
      if (error) {
        console.log(error);
      }
    }
  }
};

// 知识库的来源，可以配置
loadData([
  "https://en.wikipedia.org/wiki/Samsung_Galaxy_S25",
  // "https://en.wikipedia.org/wiki/Samsung_Galaxy_S24",
  // "https://en.wikipedia.org/wiki/IPhone_16",
  // "https://en.wikipedia.org/wiki/IPhone_16_Pro",
  // "https://en.wikipedia.org/wiki/IPhone_15",
  // "https://en.wikipedia.org/wiki/IPhone_15_Pro",
]);
