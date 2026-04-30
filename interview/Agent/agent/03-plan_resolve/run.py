from dotenv import load_dotenv
load_dotenv()

from plan_resolve import PlanResolveAgent
from plan_resolve.llm import LLMConfig, LLMClient
from plan_resolve.tools import ToolRegistry, ToolExecutor
from plan_resolve.tools.builtin import search_tool
from plan_resolve.agent import Planner, Resolver

def main():
    # 1. 初始化 LLM
    config = LLMConfig.from_env()
    llm_client = LLMClient(config)

    # 2. 初始化工具
    registry = ToolRegistry()
    registry.register_tool(search_tool)
    executor = ToolExecutor(registry)

    # 3. 初始化 Agent 组件
    planner = Planner(llm_client)
    resolver = Resolver(llm_client)
    agent = PlanResolveAgent(planner, resolver, executor)

    # 4. 运行
    question = "苹果17手机有哪些亮点"
    answer = agent.run(question,stream=True,
                       on_token=lambda token: print(token, end="", flush=True),
                       )
    print(f"\n最终答案:\n{answer}")

if __name__ == "__main__":
    main()
