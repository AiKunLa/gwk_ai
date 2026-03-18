import {
    HumanMessage,
    SystemMessage,
    ToolMessage
} from '@langchain/core/messages'
import chalk from 'chalk'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { ChatOpenAI } from '@langchain/openai'
import 'dotenv/config'

const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        "amap-maps-streamableHTTP": {
            url: `${process.env.MCP_SERVER_URL_AMAP_MAPS_STREAMABLEHTTP}${process.env.MCP_SERVER_API_KEY_AMAP_MAPS_STREAMABLEHTTP}`
        },
        // // 文件操作工具，提供列目录、读文件、写文件等功能
        // 'filesystem': {

        // }
    }
})

const model = new ChatOpenAI({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        basePath: process.env.OPENAI_BASE_URL
    }
})

const tools = await mcpClient.getTools()

const modelWithTools = model.bindTools(tools)

/**
 * 限制并发数执行工具调用
 * @param {*} toolCalls 工具调用数组
 * @param {number} maxConcurrency 最大并发数
 * @returns
 */
async function invokeWithConcurrencyLimit(toolCalls, maxConcurrency = 3) {
    const results = []

    // 分批处理，每批最多 maxConcurrency 个
    for (let i = 0; i < toolCalls.length; i += maxConcurrency) {
        const batch = toolCalls.slice(i, i + maxConcurrency)
        console.log(chalk.cyan(`执行第 ${Math.floor(i / maxConcurrency) + 1} 批工具调用 (${batch.length} 个)`))

        const batchResults = await Promise.all(
            batch.map(async (toolCall) => {
                const tool = tools.find(t => t.name === toolCall.name)
                if (!tool) {
                    return {
                        toolCall,
                        success: false,
                        error: `未找到工具: ${toolCall.name}`
                    }
                }
                try {
                    const result = await tool.invoke(toolCall.args)
                    return {
                        toolCall,
                        success: true,
                        result
                    }
                } catch (error) {
                    return {
                        toolCall,
                        success: false,
                        error: error.message
                    }
                }
            })
        )

        results.push(...batchResults)
    }

    return results
}

/**
 * 并行执行所有工具调用，返回结果数组
 * @param {*} response
 * @returns
 */
async function invokAllTools(response) {
    // 限制最大并发数为4
    return await invokeWithConcurrencyLimit(response.tool_calls, 4)
}


async function runAgentWithTools(query, maxIterations = 30) {
    // 系统消息：引导 LLM 一次性规划所有工具调用
    const systemMessage = new SystemMessage(`你是一个智能助手。当你需要调用工具时，请遵循以下原则：

1. **先规划再行动**：在第一次响应时，根据用户问题规划出需要的所有工具调用
2. **一次性返回**：不要分多轮调用工具，而是在同一轮响应中一次性返回所有需要调用的工具
3. **依赖关系**：如果某个工具的输入依赖另一个工具的输出（如先搜索再查详情），可以按依赖顺序排列，但仍在同一轮返回

请确保在第一次响应中就返回所有工具调用，不要让用户等待多轮。`)

    const messages = [
        systemMessage,
        new HumanMessage(query)
    ]
    // AI 会分步骤调用工具，每轮对话后检查是否有工具调用，如果有就执行工具并把结果反馈给 AI，直到没有工具调用了，或者达到最大迭代次数
    for (let i = 0; i < maxIterations; i++) {// 最多迭代30次，防止死循环
        console.log(chalk.bgGreen(`\n=== 第 ${i + 1} 轮对话 ===`))
        const response = await modelWithTools.invoke(messages)
        messages.push(response)

        if (!response.tool_calls || response.tool_calls.length === 0) {
            console.log(chalk.bgGreen(`\n AI 最终回复：${response.content}`))
            return response.content
        }

        console.log(chalk.yellow(`检测到${response.tool_calls.length}个工具调用`))
        console.log(`工具调用：${response.tool_calls.map(t => t.name).join(', ')}`)

        // 并行执行所有工具调用
        const toolResults = await invokAllTools(response)

        // 处理工具调用结果
        for (const { toolCall, success, result, error } of toolResults) {
            if (success) {
                console.log(chalk.bgBlue(`✓ 工具 ${toolCall.name} 调用成功`))
                messages.push(new ToolMessage({
                    content: result,
                    tool_call_id: toolCall.id
                }))
            } else {
                console.log(chalk.bgRed(`✗ 工具 ${toolCall.name} 调用失败: ${error}`))
                messages.push(new ToolMessage({
                    content: `工具调用失败：${error}`,
                    tool_call_id: toolCall.id
                }))
            }
        }
    }

    console.log(chalk.bgRed('达到最大迭代次数，停止执行'))
    return messages[messages.length - 1].content
}




await runAgentWithTools('查询北京南站附件的酒店,以及每个酒店的详细说明')
// await runAgentWithTools('选出两个北京南站附件的酒店，生成md文档并保存到当前目录下')

// await runAgentWithTools(`
//     北京南站附件的两个酒店，临近的桑酒店，拿到酒店图片，展开浏览器，展示每个酒店图片，每个tab一个url展示，并吧那个页面标题改为酒店名字
//     `)

await mcpClient.close()