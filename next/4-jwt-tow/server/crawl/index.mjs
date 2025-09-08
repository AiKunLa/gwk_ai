import { config } from "dotenv";
import { writeFile } from "fs/promises"; // 
import { join } from "path";
import { createCrawl, createCrawlOpenAI } from "x-crawl";
config();

const crawlApp = createCrawl({
  maxRetry: 3,
  intervalTime: {
    max: 2000,
    min: 1000,
  },
});

const crawlOpenAIApp = createCrawlOpenAI({
  clientOptions: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  defaultModel: {
    chatModel: "gpt-4o",
  },
});

const writeJSONToFile = async (data, filename) => {
  const filePath = join(process.cwd(), filename);
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("写入失败");
  }
};

crawlApp.crawlPage("https://www.cnblogs.com/").then(async (res) => {
  const { page, browser } = res.data;
  const targetSelector = "#post_list";
  // page是Puppeteer 的一个实例，可以理解为浏览器的一个标签页，我们可以在这个页面上进行一系列的操作
  await page.waitForSelector(targetSelector);

  // 使用 page.$eval 方法获取目标选择器对应的元素的 HTML 内容，并将其赋值给 highlyHTML 变量
  const highlyHTML = await page.$eval(targetSelector, (el) => el.innerHTML);

  const result = await crawlOpenAIApp.parseElements(
    highlyHTML,
    `
        获取每一个.post-item元素里面都.post-item-title里面的标题,
        .post-item-summary里面的纯文本摘要，以JSON格式返回。如：
        [{
            "title":"找到合适的PHP异步方案",
            "content":"REGEXP"
        }]
    `
  );

  console.log(highlyHTML);
  await browser.close();
  await writeJSONToFile(result, "data/posts.json");
});
