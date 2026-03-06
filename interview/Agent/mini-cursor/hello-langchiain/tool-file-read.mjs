import 'dotenv/config'

console.log(process.env.OPENAI_API_KEY, "/////")

import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'

// 三个封装的消息通信，分别为与人、工具、系统提供消息通信
import { HumanMessage, ToolMessage, SystemMessage } from '@langchain/core/messages'

