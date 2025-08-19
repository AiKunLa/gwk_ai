import OpenAI from "openai"; // es6 module

const client = new OpenAI({
  apiKey: "sk-h91KBBHUC30pbiviNhD9I5YnyC7gcdd4CzPCKJcMhnkm7IT9",
  baseURL: "https://api.302.ai/v1",
});

async function main() {
  const resp = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: "今天抚州天气怎么样?",
      },
    ],
    // 定义LLM 可以使用的工具 , 大模型会先检查tools种是否有工具可以实现想要的结果
    tools: [
      {
        // 指定工具的类型为函数
        type: "function",
        // 函数的具体信息
        function: {
          //函数名
          name: "getWeather",
          // 描述函数的功能
          description: "获取某个城市的天气",
          // 定义函数的参数
          parameters: {
            // 参数的类型为对象
            type: "object",
            // 对象的属性
            properties: {
              city: {
                type: "string",
              },
            },
            // 定义city是必须的参数
            required: ["city"],
          },
        },
      },
    ],
  });

  // 获取工具返回的结果
  const toolCall = resp.choices[0].message.tool_calls?.[0];
  // 将返回的结果再给大模型
  if (toolCall?.function.name === "getWeather") {
    const args = JSON.parse(toolCall.function.arguments);
    // 
    const weather = await getWeather(args.city);

    const secondResp = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "抚州",
        },
        resp.choices[0].message, //tool
        {
          role: "tool",
          // 上次大模型执行的id ，来接上上次大模型的执行（应为中间调用了工具）
          tool_call_id: toolCall.id,
          content: JSON.stringify(weather),
        },
      ],
    });
    console.log(secondResp)
  }
}

main();
