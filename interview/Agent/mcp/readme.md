# mcp
之前的工具调用都是本地手写的function-call，若要进一步拓展，则每一个功能都需要去自己写function

- mini-cursor
 llm with tools 不太满意
 怎么吧llm能干活的甜头扩大？ 使用更多的tools，更好的tool，第三方的tool
 向外提供tool 大厂将自己的服务以mcp的方式向外提供
 - 80%的App会消失
 - 集成第三方的mcp （若工具不是node写的，那么我们就无法运行，所有要使用mcp）
 - node 调用 java/python/rust 等其他语言的tool
 - 调用远程的tool

## MCP
Model Context Protocol Anthorpic  模型上下文协议
在大量的将本地，跨语言、第三方的tool集成到Agent里来，让llm强大的同时，也会带来以定的复杂性（对接联调）

而mcp则就是一个接口协议，遵顼这个协议的tool就可以被直接使用

## 按照MCP协议来开发， 将我们的服务器或资源 输出出去

## MCP协议还有通信部分
这个工具可以在本地运行，也可以远程调用执行，
    - stdio 本地命令行 子进程中执行
    - http 远程调用

## mcp最大的特点就是可以跨进程调用工具
    - 子进程 node：child-process
    - 跨进程 在子进程中执行java/rust
    - 远程进程 实际上就是第三方提供的mcp 服务

    这样llm可以干更加强大的任务，任务更加繁杂，所以需要规范

    过去：每个 AI 应用都需要为每个工具（GitHub, Slack, 数据库等）单独写定制代码。
    现在：只要工具支持 MCP 标准，任何支持 MCP 的 AI 客户端（如 Claude Code, Claude Desktop）都可以直接连接并使用它，无需额外开发。

## 编写满足mcp协议规范的tool

- Model Context Protocol
    tool result , ToolMessage Context

- sdk @modelcontextprotocol/sdk

- 手写MCP tool
 - C/S架构


## mcp三者关系
- mcp host
 cursor/ vite Agent host
 AI应用本身，分则调度，
- MCP Client
 嵌入在Host中的协议实现，负责通信，SDK内部实现，实现mcp规范的tools
- MCP Server
 mcp tool 运行的服务器
 自己提供工具/资源服务器  my-mcp-server.mjs

- 工作流程
    - mcp hosts 配置文件
    - initalize 时会发送请求 获取mcp server 提供的列表和详情

    - host 检索mcp配置文件，
    - 若是远程的mcp服务则发送http请求，若是本地则进行进程通信
    -

## MCP 开发流程
- 1、使用new McpServer创建mcp server 实例
- 2. 使用server.register Tool/Resource/Prompt 名字 描述 URL
- 3. 通信方式 StdioserverTransprot 本地     HttpServerTransprot远程
- 4. server.connect(transport)

## mcp直接入住Agent程序
- 如何吧mcp tools集成到程序里面
    mcp是可以插拔的，只要遵守协议
