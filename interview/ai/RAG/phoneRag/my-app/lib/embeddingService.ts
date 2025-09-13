import { embed } from "ai";
import { config } from "./config";
import { openai } from "./openai";

/**
 * 为文本内容生成向量嵌入
 * @param text - 要嵌入的文本
 * @returns 向量嵌入结果
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  const { embedding } = await embed({
    model: openai.embedding(config.embedModel),
    value: text,
  });
  return embedding;
};
