// Browser/Server 架构  html
// Client/Server  客户端（trae cursor之类的）

// mcp  client
// mcp server 
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
// 标准输入输出流，通信
import { StdoServerTransport } from '@modelcontextprotocol/sdk'
import { z } from 'zod'
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
        userId: z.string().description("用户 ID，例如：001，002，003")
    }
}, async ({ userId }) => {
    const user = datebase.users(userId)
    if (user) {
        return {
            content: {
                type: 'text',
                text: `用户信息：\n -ID:${user.id} \n -姓名：${user.name}\n 邮箱：${user.email}`
            }
        }
    } else {
        return {
            content: {
                type: 'text',
                text: `用户ID：${user.id} 不存在。可用id：001，002，003`
            }
        }
    }
})


const transport = new StdoServerTransport()
await server.connect(transport)
