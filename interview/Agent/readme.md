# 手写cursor 最小版本

- 千问点奶茶意味着什么呢
    传统互联网向Ai Agent推理转变。新时代的产品，更加复杂更加智能和强大
- OpenClaw 小龙虾
    一人公司、虚拟数字人、多Agent协调


- AI Agent 如何打造
    - 不是去直接调用大模型获取代码
    - 如何让大模型记住聊天过的消息
    - 如何让他去访问一个网页，去做一些事情
    - 如何让他去基于秘密文档去做RAG

    AI Agent = llm + Memory + Tool + RAG

## Agent是什么？
    其实就是给大模型拓展了Tool和Memory， 他本来可以思考、规划、你给他用tool拓展了能力。他就可以**自动**做事情，并用Memory管理记忆，还可以使用RAG查询内部知识库来获取知识

    Agent是这样一个知道内部知识、能思考规划、有记忆，能够帮你做事情扩大后的大模型


## Tool
    - 

### 用react 创建一个todolist
- 任务 ，Cursor调用编程Agent
- llm思考，规划生成代码
- tool 调用bash，执行命令


### LangChain
AI Agent 框架 提供了memory tool 、rag封装

需要后端功底

## LLM with Tools

- llm 选择
    qwen

- tools
    read、write文件，exce命令执行
