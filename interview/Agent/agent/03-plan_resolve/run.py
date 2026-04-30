from dotenv import load_dotenv

from plan_resolve import PlanResolveAgent
from plan_resolve.agent import Planner, Resolver, StepReasoner
from plan_resolve.llm import LLMClient, LLMConfig
from plan_resolve.tools import ToolExecutor, ToolRegistry
from plan_resolve.tools.builtin import search_tool

load_dotenv()


def main() -> None:
    config = LLMConfig.from_env()
    llm_client = LLMClient(config)

    registry = ToolRegistry()
    registry.register_tool(search_tool)
    executor = ToolExecutor(registry)

    planner = Planner(llm_client)
    resolver = Resolver(llm_client)
    step_reasoner = StepReasoner(llm_client)
    agent = PlanResolveAgent(planner, resolver, executor, step_reasoner)

    question = (
        "查找关于今年五一去华山旅游的攻略，找2个就行，然后整理成一篇能发小红书的文案"
    )
    agent.run(question, stream=True)


if __name__ == "__main__":
    main()
