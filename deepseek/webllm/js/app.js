// 由openai
// 请求行
const endpoint = "https://api.deepseek.com/chat/completions";
//请求头
const headers = {
  "Content-Type": "application/json",
  // Bearer 是一种身份验证机制，用于在 HTTP 请求中传递安全的凭据。
  Authorization: "Bearer sk-6c5308fae67c4845adcf69a6b92a6c37 ", // 替换为你的 DeepSeek API 密钥
};

// 请求体
const payload = {
  model: "deepseek-ai/deepseek-llama-3-8b-instruct", // 替换为你想要使用的模型
  
  messages: [
    { role: "user", content: "你是谁" }, // 替换为你的问题
  ],

}
fetch(endpoint, {
  method: "POST", // 请求方法
  headers: headers, // 请求头
  body: JSON.stringify(payload), // 请求体
})