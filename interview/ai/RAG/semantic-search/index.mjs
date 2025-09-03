import { client, cosineSimilarity } from "./llm.mjs";
import fs from "fs/promises";

const inputFilePath = "./data/post_with_embedding.json";
const data = await fs.readFile(inputFilePath, "utf-8");
const posts = JSON.parse(data);

// embeddings, 用于向量化，eg 将你好转为一个向量
const res = await client.embeddings.create({
  model: "text-embedding-ada-002",
  input: `react`,
});
const { embedding } = res.data[0];
// 输出一个向量
console.log(res.data[0].embedding);

const result = posts
  .map((item) => ({
    ...item,
    similarity: cosineSimilarity(embedding, item.embeddings),
  }))
  .sort((a, b) => a.similarity - b.similarity)
  // 反转
  .reverse()
  .slice(0, 3) // 取前三个
  // 拼接对象
  .map((item, index) => `${index + 1}.${item.title},${item.category}`)
  .join("\n");

console.log(result);
