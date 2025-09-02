import OpenAI from "openai";
import { config } from "dotenv";
config();

// 获取env
// console.log(process.env.OPENAI_API_KEY)

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 没有缓存上下文对话的时候
async function noMemoryChat() {
  const res1 = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "我的名字是Sharkman",
      },
    ],
  });
  console.log("First res", res1.choices[0].message.content);
  const res2 = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "我的名字是什么",
      },
    ],
  });
  console.log("Second res", res2.choices[0].message.content);
}
noMemoryChat();
