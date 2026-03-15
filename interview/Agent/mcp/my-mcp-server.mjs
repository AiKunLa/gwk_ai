// Browser/Server 架构  html
// Client/Server  客户端（trae cursor之类的）

// mcp  client
// mcp server
// mcp 服务
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
// 标准输入输出流，负责进程之间通信
/**
 * 客户端通过 stdin 发送 JSON-RPC 请求
服务器通过 stdout 返回 JSON-RPC 响应
适合本地进程间通信，不需要网络
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
// tool 数据库服务
const datebase = {
    users: {
        "001": { id: "001", name: "Alice", age: 30, email: "alice@example.com", role: "admin" },
        "002": { id: "002", name: "Bob", age: 25, email: "bob@example.com", role: "user" },
        "003": { id: "003", name: "Charlie", age: 35, email: "charlie@example.com", role: "user" }
    }
}

const server = new McpServer({
    name: 'my-mcp-server',
    version: '1.0.0'
})

// 注册工具 tool
server.registerTool('query-user', {
    description: '查询数据库中的用户信息。输入用户ID，返回该用户的详细信息（姓名、邮箱、角色）',
    inputSchema: {
        type: 'object',
        properties: {
            userId: {
                type: 'string',
                description: "用户 ID，例如：001，002，003"
            }
        },
        required: ['userId']
    }
}, async ({ userId }) => {
    const user = datebase.users[userId]
    if (user) {
        return {
            content: [{
                type: 'text',
                text: `用户信息：\n -ID:${user.id} \n -姓名：${user.name}\n 邮箱：${user.email}`
            }]
        }
    } else {
        return {
            content: [{
                type: 'text',
                text: `用户ID：${userId} 不存在。可用id：001，002，003`
            }]
        }
    }
})

// 注册提示模板 Prompts
// 让 AI 使用预定义的提示模板，标准化 AI 行为
server.registerPrompt('用户报告', 'prompt://user-report', {
    description: "生成用户详细信息报告的模板",
    arguments: [
        { name: 'userId', description: "用户ID，例如：001，002，003", required: true }
    ]
}, async ({ userId }) => {
    const user = datebase.users[userId]
    if (!user) {
        return {
            messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `用户ID：${userId} 不存在。可用id：001，002，003`
                }
            }]
        }
    }
    return {
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `请生成用户 "${user.name}" 的详细报告，包含以下信息：
- 基本信息（姓名、邮箱、角色）
- 账户状态分析
- 建议操作`
            }
        }]
    }
})

// 注册资源： 使用指南 提供资源给llm
// Model Context Protocol 模型上下文协议
// Model Tool Resource PromptTemplate Protocol

// context = tool + resource + promptTemplate

//  第二个参数是URL，统一资源标识符
/**
 * 当用户在 Cursor/Claude Code 中说 "告诉我这个 MCP 服务器怎么用" 时，AI 可以自动调用 docs://guide 资源，返回你定义的文档内容。
类似给 AI 提供一个可查询的知识库。
 */
server.registerResource('使用指南', 'docs://guide', {
    description: "MCP Server 使用文档",
    mimeType: 'text/plain',
}, async ()=> {
    return {
        content: [
            {
                uri:'docs://guide',
                minType:'text/plain',
                text:  `MCP Server 使用指南
                功能：提供用户查询等工具。
                使用：在Cursor 等MCP Client 中通过自然语言对话
                `
            }
        ]
    }
})

const transport = new StdioServerTransport()
await server.connect(transport)