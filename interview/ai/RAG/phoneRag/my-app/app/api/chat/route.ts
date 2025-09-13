// AI SDK 中用于流式输出响应的函数

import { generateEmbedding } from "@/lib/embeddingService";
import { supabase } from "@/lib/supabase";
import { openai, streamText } from "@/lib/openai";

// export async function POST() {
//   const result = await streamText({
//     model: openai("gpt-3.5-turbo"),
//     prompt: "你好，请简单介绍一下你自己。",
//   });

//   // 将streamText 生成的流式结果转换为一个可以被前端消费的Response对象，从而支持流式输出
//   return result.toDataStreamResponse();
// }

// 从向量数据库中检索与用户查询相关的上下文信息
// @param embedding - 用户查询的向量化表示
// @returns 相关上下文信息的字符串表示
async function fetchRelevantContext(embedding: number[]) {
  const { data, error } = await supabase.rpc("get_relevant_chunks", {
    query_vector: embedding,
    match_threshold: 0.7,
    match_count: 3,
  });
  if (error) throw error;
  return JSON.stringify(
    data.map(
      (item: any) => `
      Source: ${item.url}
      Date Updated: ${item.date_updated}
      Content: ${item.content}
    `
    )
  );
}

// 创建提示模板
const createPrompt = (context: string, userQuestion: string) => {
  return {
    role: "system",
    content: `
      你是一个专业的游戏攻略智能顾问，旨在为玩家提供精准、实用的游戏攻略信息。
      请使用以下提供的游戏攻略上下文来回答玩家的问题：
      ----------------
      开始上下文
      ${context}
      结束上下文
      ----------------
      
      请以Markdown格式返回答案，包括必要的步骤、技巧和注意事项。若有相关链接，请一并提供。
      如果提供的上下文信息不足以回答问题，请基于你的游戏知识进行解答，但请明确告知用户这部分内容可能不是最新的。
      如果用户的问题与游戏无关，请礼貌地告知用户你只能回答与游戏相关的问题。
      
      ----------------
      玩家问题：${userQuestion}
      ----------------
    `,
  };
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastestMessage = messages.at(-1).content;
    // 向量化用户消息
    const embedding = await generateEmbedding(lastestMessage);
    // 从su数据库中查询
    const context = await fetchRelevantContext(embedding);
    // 创建提示模板
    const prompt = createPrompt(context, lastestMessage);
    // 调用AI模型
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [prompt, ...messages],
    });

    // 将streamText 生成的流式结果转换为一个可以被前端消费的Response对象，从而支持流式输出
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error fetching relevant context:", error);
  }
}
