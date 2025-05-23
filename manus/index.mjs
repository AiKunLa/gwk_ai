// 入口文件
// ai llm sdk 标准  （openai接口标准）
import OpenAI from "openai"; // 模块化引入 OpenAI 代表的是一个类 即从modules中引入OpenAI类

const openai = new OpenAI({
  apiKey: "sk-mqkzylwnxdtjxddfyqxivtcbnxhknosbspsvupolprjexchx", // 填入自己的API key  身份
  baseURL: "https://api.siliconflow.cn/v1", // 国内转发服务
});
// 调用接口  完成接口
// 等待大模型返回结果

const response = await openai.completions.create({
  model: "Qwen/QwQ-32B", // 模型选择
  max_tokens: 1000, // 最大生成token数
  temperature: 0.5, // 温度
  prompt: `Consideration product : 工厂现货PVC充气青蛙夜市地摊热卖充气玩具发光蛙儿童水上玩具

1. Compose human readable product title used on Amazon in english within 20 words.
2. Write 5 selling points for the products in Amazon.
3. Evaluate a price range for this product in U.S.

Output the result in json format with three properties called title, selling_points and price_range`, // 提示词
});
console.log(response);
