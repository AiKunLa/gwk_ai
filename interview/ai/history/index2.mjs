import OpenAI from "openai";
import { config } from "dotenv";
config();
// 创建一个对话
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 使用一个变量来缓存总结的上下文对象
let summary = "用户的基本信息:";
const messages = [
  {
    role: "system",
    content: "你是一个友好的助教",
  },
];
// 没有缓存上下文对话的时候
async function useMemoryChat(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  }); // 放入缓存中

  // 若对话过长，则进行整合
  if (messages.length >= 10) {
    const toRes = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "请总结一下对话的关键信息" },
        ...messages,
      ],
    });
    summary += toRes.choices[0].message.content;
    messages.splice(0, messages.length); // 清空老聊天记录
  }

  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `你是一个助教，这是目前的总结：${summary}`,
      },
      ...messages,
    ],
  });
  // 获取相应，保存数据到缓存中
  const reply = res.choices[0].message.content;
  messages.push({
    role: "assistant",
    content: reply,
  });

  console.log("AI reply", reply);
}
useMemoryChat();
