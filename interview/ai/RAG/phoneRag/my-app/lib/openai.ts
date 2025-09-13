import { createOpenAI } from "@ai-sdk/openai";
import { config } from "./config";
import { streamText } from "ai";

// 创建并导出OpenAI客户端实例
export const openai = createOpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseURL,
});


// 导出streamText函数，用于流式文本生成
export { streamText };

// 导出createOpenAI函数以便在需要时创建自定义客户端
export { createOpenAI } from "@ai-sdk/openai";