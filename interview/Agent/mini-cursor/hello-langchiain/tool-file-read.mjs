import 'dotenv/config'

console.log(process.env.OPENAI_API_KEY, "/////")

import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'

// 三个封装的消息通信，分别为与人、工具、系统提供消息通信
import { HumanMessage, ToolMessage, SystemMessage } from '@langchain/core/messages'

// 引入node文件处理包中异步文件读写工具
import fs from 'node:fs/promises'
// 引入数据校验zod，
import { z } from 'zod'


const model = new ChatOpenAI({
    model: process.env.MODEL_NAME,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL
    }
})

// 工具定义
const readFileTool = tool(
    // 工具执行回调
    async ({ path }) => {
        const content = await fs.readFile(path, 'utf-8')
        console.log(`[工具调用]`)
        return content
    },


    // 工具描述
    {
        name: 'read file',
        description: '用此工具读取文件内容。当用户需要读取文件、查看代码时、分析文件内容时，调用此工具。输入文件路径（可以是相对路径或绝对路径）',
        // 使用zod定义工具输入参数的校验规则，要求输入对象中必须包含一个字符串类型的path字段，描述为“文件路径”
        schema: z.object({ path: z.string().describe('文件路径') })
    }
);

// 工具集合
const tools = [readFileTool]

// 将模型和工具绑定，让模型可以使用tool
const modelWithTools = model.bindTools(tools)
const messages = [
    new SystemMessage(`
    你是一个专业的代码助手，可以使用工具读取文件并解释代码。
    工作流程：
    1. 用户要去读取文件时，立即调用read_file工具
    2. 等待工具返回文件内容
    3. 基于文件内容进行分析和解释
    
    可用工具：
    - read_file: 读取文件内容 （使用此工具来获取文件内容）
    `),
    new HumanMessage('请读取tool-file-read.mjs文件内容并解释代码')
]


// llm理解用户要求，知道要调用工具，返回要调用的工具名称
// 从tool-call中找到调用工具，并调用工具
// 执行result ，获取文件内容，再次交给大模型 最后返回结果
let response = await modelWithTools.invoke(messages);
console.log(response.content)

messages.push(response) // 将模型要调用工具也加入message，记录这次对话

// 当读有工具，且工具数量大于0
while (response.tool_calls && response.tool_calls.length > 0) {
    console.log(`\n[检测到${response.tool_calls.length}个工具调用]`)
    const toolResults = await Promise.all(
        // 找出llm要调用的工具
        response.tool_calls.map(
            async (toolCall) => {
                const tool = tools.find(t => t.name === toolCall.name)
                if (!tool) {
                    return `找不到工具${toolCall.name}`
                }
                console.log(`[执行工具]${toolCall.name}(${JSON.stringify(toolCall.args)})`)
                try {
                    const result = await tool.invoke(toolCall.args)
                    return result
                } catch (error) {
                    return `error: ${error.messages}`
                }
            }
        )
    )
    // 将工具调用的消息进行存储
    response.tool_calls.forEach((toolCall, index) => {
        messages.push(
            new ToolMessage({
                content: toolResults[index],
                tool_call_id: toolCall.id
            })
        )
    })

    // 调用工具获取信息后，再次将信息交给大模型进行处理，此时的返回若大模型不需要调用工具则推出循环
    response = await modelWithTools.invoke(messages)

}