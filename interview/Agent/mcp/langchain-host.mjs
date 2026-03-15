import 'dotenv/config'
// MultiServerMCPClient 是 LangChain 提供的 MCP 客户端适配器，作用是让 LangChain/LLM 能够调用多个 MCP Server
// 协调多个服务员为LLM提供服务
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, ToolMessage } from '@langchain/core/messages'
import chalk from 'chalk'


const model = new ChatOpenAI({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        basePath: process.env.OPENAI_API_BASE_URL
    }
})


// 与mcp server进行通信获取 mcp server信息
const mcpClient = new MultiServerMCPClient({
    // 这里实际上就是mcp配置文件
    mcpServers: {
        'my-mcp-server': {
            command: 'node',
            args: ['./my-mcp-server.mjs']
        }
    }
})

// 获取工具列表，工具就是mcp server注册的功能
const tools = await mcpClient.getTools()

const modelWithTools = model.bindTools(tools)

async function runAgentWithTools(query, maxIterations = 20) {
    const messages = [
        new HumanMessage(query)
    ]
    for (let i = 0; i < maxIterations; i++) {
        console.log(chalk.gray(`[${i}] AI 思考中...`))
        const response = await modelWithTools.invoke(messages)
        messages.push(response)

        // 不需要调用工具，直接返回内容
        if (!response.tool_calls || response.tool_calls.length === 0) {
            return response.content
        }

        // 需要调用工具
        console.log(chalk.yellow(`调用工具: ${response.tool_calls.map(tc => tc.name).join(', ')}`))

        for (const toolCall of response.tool_calls) {
            const tool = tools.find(t => t.name === toolCall.name)
            if (!tool) continue

            const args = typeof toolCall.args === 'string'
                ? JSON.parse(toolCall.args)
                : toolCall.args

            try {
                const result = await tool.invoke(args)
                console.log(chalk.green(`✓ ${toolCall.name} => ${result}`))
                messages.push(new ToolMessage({
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                    content: result
                }))
            } catch (error) {
                console.log(chalk.red(`✗ ${toolCall.name} => ${error.message}`))
                messages.push(new ToolMessage({
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                    content: error.message
                }))
            }
        }
    }
    return messages[messages.length - 1].content
}

const result = await runAgentWithTools('查看一下用户id为002的信息')
console.log('\n--- 最终回复 ---')
console.log(result)

await mcpClient.close()