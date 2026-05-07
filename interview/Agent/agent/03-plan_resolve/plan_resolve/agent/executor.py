
from ..llm import LLMClient

class Executor:
    def __init__(self,llm_client: LLMClient):
        self.llm_client = llm_client

    def execute(self,question:str,plan:list[str]) -> str :
        history = ""

        print("\n执行计划")

        for i,step in enumerate(plan):
            print(f"\n-> 正在执行步骤 {i+1}/{len(plan)}: {step}")

            