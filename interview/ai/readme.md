# AI方面的面试
- AI发展
chatbot -> 推理 -> Agent (coze) -> 创新能力 -> 组织能力

- LLM 调用AIP 有什么缺点
    1. LLM是提前训练好的，它对于新的知识或服务是不了解的，需要对这方面从新训练
    2. 对于一些私有的知识库是无法了解到，也不可能让其他的大模型来获取私有数据库
    3. 若AIGC 没有足够的上下文，则会胡说八道。
        - 需要足够的上下文
        - 或者调用Function Call 来调用外部的天气服务
        - MCP
            相对于给大模型插入USB，给它提供知识库，设置预定的prompt来指定返回的格式
        - 通过使用工作流来实现
            通过设计节点让LLM流程化，
    如何让LLM调用外部的工具

## Function Call
    通过调用调用外部工具或API来获取实时信息，执行计算或操作，从而获取最新数据。精确计算与外部系统交互的复杂任务。
    让AIGC 从只会生成文本进化为可靠执行操作，解决了自然语言到结构化调用的鸿沟。是模型能安全、可控地调用外部系统服务，推动实用化落地。
    
    eg：“帮我订明天北京到上海的航班”
    - 简洁、方便
    - 形成了一种依赖，用户对AI的一个依赖

- Function Call 的依赖
    项目初始化  npm init -y
    具体操作 按照依赖，npm i openai
    - 从传统的chat api 调用 变成两步
        - 先根据prompt和tools中的description语义关联性分析
        - 执行function
        - 将函数的返回结果再次交给LLM，让LLM理解。从而和用户进行正常的聊天

- 核心
    - openai 接口能力的升级，LLM可以和外部系统、工具互动，让LLM能力增强
    - chatbot 的用户体验更好，让用户对产品更具的依赖
    - api 是增量式的，设计的很简约，学到了接口设计
        - function tool tools声明
            type、name、parameters
        - 返回结果 function.id
            role:tool

## MCP
Model Context Protocol 
    **它是一个协议，类似于web开发的restful协议，是一种如何将外部资源暴露给LLM的协议和风格。**
    它是Function Call 的升级版本
    当我们在做各种Function Call 的时候每个服务的接口是不一样的，这样很混乱，但是mcp统一了一切。
    - MCP是LLM与外界之间的通信协议，就像USB，他能够对LLM训练完后的不了解的知识进行连接
    LLM他本身不知道怎么调用地图、数据库、搜索引擎，而MCP规定了标准的上下文交换方式，让大模型能像调用API一样去访问这些外部资源。

    就比如，我们要让大模型调用高德地图的API，我们需要先注册高德地图的MCP，然后在MCP中定义一个接口，这个接口的参数就是我们要调用的API的参数，返回结果就是我们要调用的API的返回结果。
    然后我们在大模型中调用这个接口，就可以调用高德地图的API了。
    当我们对AI发起一个，请帮我规划公司到机场的路线。模型根据会通过高德地图MCP插件，获取实时路径和交通数据
- 优点
让LLM输出更加可靠，降低集成成本。数据更加安全可控，




- 安装mcp 客户端 cline
- 注册高德地图的mcp

1. demo
    npm init -y
    npm i @modelcontextprotocol/sdk

2. MCP Server 是基于mcp协议的服务软件
    定义tool
    - mcp client  cline/cursor
        配置mcp server
        LLM -》 MCP Client -》 MCP Server，  client 根据对内容的判定 来决定是否使用大模型，它先去问大模型本地是否有MCP Server能够解决用户的需求，
        如果有，就调用MCP Server，然后获取MCP Server返回的数据，并将其交给LLM，LLM再根据返回的数据，生成最终的结果。
        如果没有，就调用大模型。


## ollama
这是一个让你可以通过简单命令在本地轻松下载、运行和管理大语言模型的工具，支持GPU加速和类OPENAI接口，适合本地部署和开发

命令
    ollama pull deepseek-r1:1.5b 下载大模型
    ollama run deepseek-r1:1.5b 运行大模型

在11434端口提供api 调用


- 免费模型
    Meta Llama 羊驼
    deepseek-r1:1.5b  参数的尺寸
    Qwen