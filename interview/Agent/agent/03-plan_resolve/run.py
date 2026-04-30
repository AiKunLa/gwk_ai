"""
Plan-and-Resolve Agent 运行入口

演示如何组装各组件：
1. LLMClient - OpenAI 兼容 API 客户端
2. ToolRegistry + ToolExecutor - 工具注册与执行
3. Planner + Resolver - 规划与整合
4. PlanResolveAgent - 核心编排器

环境变量（.env 文件）：
- MODEL_ID: 模型名称，默认 gpt-4
- API_KEY: API 密钥
- BASE_URL: API 端点
- SERPAPI_API_KEY: SerpAPI 密钥（用于搜索）
"""

from dotenv import load_dotenv

from plan_resolve import PlanResolveAgent
from plan_resolve.agent import Planner, Resolver
from plan_resolve.llm import LLMClient, LLMConfig
from plan_resolve.tools import ToolExecutor, ToolRegistry
from plan_resolve.tools.builtin import search_tool

load_dotenv()


def main() -> None:
    # 1. 初始化 LLM 客户端
    config = LLMConfig.from_env()
    llm_client = LLMClient(config)

    # 2. 初始化工具注册表和执行器
    registry = ToolRegistry()
    registry.register_tool(search_tool)
    executor = ToolExecutor(registry)

    # 3. 初始化 Planner 和 Resolver
    planner = Planner(llm_client)
    resolver = Resolver(llm_client)

    # 4. 组装 Agent
    agent = PlanResolveAgent(planner, resolver, executor)

    # 5. 运行
    question = "一个水果店周一卖出了15个苹果。周二卖出的苹果数量是周一的两倍。周三卖出的数量比周二少了5个。请问这三天总共卖出了多少个苹果？"
    answer = agent.run(
        question,
        stream=True,
        on_token=lambda token: print(token, end="", flush=True),
    )
    print(f"\n最终答案:\n{answer}")


if __name__ == "__main__":
    main()
