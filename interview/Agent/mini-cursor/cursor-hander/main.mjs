// 加载 .env 环境变量
import 'dotenv/config'
// OpenAI Chat 模型 - 支持 function calling
import { ChatOpenAI } from '@langchain/openai'
// LangChain 消息类型 - 用于构建对话上下文
import {
    HumanMessage,
    SystemMessage,
    ToolMessage
} from '@langchain/core/messages'
// 彩色输出
import chalk from 'chalk'
import { readFileTool, writeFileTool, executeCommanTool, listDirectoryTool } from './all_tools.mjs'
const model = new ChatOpenAI({
    modelName: process.env.MODEL_NAME,
    apiKey: process.env.OPENAI_APT_KEY,
    temperature: 0.1,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL
    }
})

// 
const tools = [readFileTool, writeFileTool, executeCommanTool, listDirectoryTool]

const modelWithTools = model.bindTools(tools)

// maxIterations = 30 是 最大循环次数，用于防止 Agent 无限循环调用工具。最多允许 30 次工具调用
// LLM不确定是否能完成，从而反复尝试
async function runAgentWithTools(query, maxIterations = 30) {
    // 检测任务完成情况
    // 不用tool
    // 在用tool llm还在自动进行中
    const messages = [
        new SystemMessage(`
            你是一个项目管理助手，使用工具完成任务。
            当前工作目录： ${process.cwd()}

            工具：
            1. read_file: 读取文件
            2. write_file: 写入文件
            3. execute_command: 执行命令(支持workingDirectory参数)
            4. list_directory: 列出目录

            重要规则 - execute_command:
            - workingDirectory 参数会自动切换到指定目录
            - 当使用workingDirectory参数时，不要在command中使用cd命令
            - 错误示例: {
                command: "cd react-todo-app && pnpm install",workingDirectory: "react-todo-app"
                这是错误的！因为workingDirectory 已经存在 react-todo-app 目录了，再cd react-todo-app 会找不到目录
            }
            - 正确示例： {
                command: "pnpm install",workingDirectory: "react-todo-app"
                这样就对了，workingDirectory已经切换到react-todo-app，直接执行命令即可
            }
                - 回复要简洁，只说做了什么
            `),
        new HumanMessage(query),
    ]
    

    // 循环是agent的核心， llm思考，规划，调整 不断迭代，直到任务完成，更加智能化
    for (let i = 0; i < maxIterations; i++) {
        // 调用模型，传入当前的对话上下文（messages），让模型根据上下文生成回复
        console.log(chalk.bgGreen(`\n[第${i + 1}轮] 正在等待AI思考...`))
        const response = await modelWithTools.invoke(messages)

        messages.push(response)
        // 打印 response 结构以便调试
        console.log(chalk.gray('Response 类型:', response.constructor.name))
        console.log(chalk.gray('Tool calls:', JSON.stringify(response.tool_calls, null, 2)))

        if (!response.tool_calls || response.tool_calls.length <= 0) {
            console.log(`最终回复： \n ${response.content}\n`)
            return response.content
        }

        console.log(chalk.yellow(`AI 调用了${response.tool_calls.length} 个工具`))

        for (const toolCall of response.tool_calls) {
            // 
            const toolArgs = toolCall.args
            const toolName = toolCall.name
            const id = toolCall.id
            const foundTool = tools.find(t => t.name === toolName)
            try {
                const result = await foundTool.invoke(toolArgs)
                console.log(chalk.green(`  ✓ ${toolName} 执行成功`))

                // 使用 convertToOpenAIToolMessage 正确创建 ToolMessage
                const toolMsg = new ToolMessage({
                    tool_call_id: id,
                    name: toolName,
                    content: result
                })
                messages.push(toolMsg)
            } catch (error) {
                console.log(chalk.red(`  ✗ ${toolName} 执行失败: ${error.message}`))
                const toolMsg = new ToolMessage({
                    tool_call_id: id,
                    name: toolName,
                    content: `工具执行失败: ${error.message}`
                })
                messages.push(toolMsg)
            }
        }
    }
    return messages[messages.length - 1].content
}


const case1 = `
    创建一个功能丰富的 React TodoList 应用：

    1. 创建项目：echo -e "\n\n" | pnpm create vite react-todo-app --template react-ts
    2. 修改 src/App.tsx，实现完整功能的 TodoList：
    - 添加、删除、编辑、标记完成
    - 分类筛选（全部/进行中/已完成）
    - 统计信息显示
    - localStorage 数据持久化
    3. 添加复杂样式：
    - 渐变背景（蓝到紫）
    - 卡片阴影、圆角
    - 悬停效果
    4. 添加动画：
    - 添加/删除时的过渡动画
    - 使用css transitions
    5.列出目录确认
`

try {
    await runAgentWithTools(case1)
} catch (error) {
    console.error(`\n 错误: ${error.message}\n`)
}