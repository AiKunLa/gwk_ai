// 负责posts.json 的模块化

// readFileSync 是同步
// readFile 是异步的，回调
// 使用promise版本的fs
import fs from "fs/promises";

import { client } from "./llm.mjs";
const inputFilePath = "./data/posts.json";

const outputFilePath = "./data/post_with_embedding.json";

// 读取
const data = await fs.readFile(inputFilePath, "utf-8");

// 转为向量
const post = JSON.parse(data);
const post_with_embedding = [];
for (const { title, category } of post) {
  // console.log(title, category, '--------');
  const response = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: `标题: ${title}; 分类: ${category}`,
  });

  post_with_embedding.push({
    title,
    category,
    embeddings: response.data[0].embedding,
  });
}

// 存储到数据库中
await fs.writeFile(
  outputFilePath,
  JSON.stringify(post_with_embedding, null, 2)
);
