
from ReActAgent import ReActAgent
from HelloAgentsLLM import HelloAgentsLLM
from tools.ToolExecutor import ToolExecutor
from tools import search

if __name__ == '__main__':
    llm_client = HelloAgentsLLM()

    fun_desc = "一个网页搜索引擎。当你需要回答关于时事、事实以及在你的知识库中找不到的信息时，应使用此工具。"

    tool_executor = ToolExecutor()
    tool_executor.registerTool("Search",fun_desc,search)

    agent = ReActAgent(llm_client,tool_executor)

    response = agent.run("2026年华为手机哪一款性价比高")

    print(response)

