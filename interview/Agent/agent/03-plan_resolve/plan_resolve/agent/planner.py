from ..llm.client import LLMClient
from ..prompts import render_planner_prompt

class Planner:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def make_plan(self, question: str, tools_desc: str) -> str:
        prompt = render_planner_prompt(question, tools_desc)
        messages = [{"role": "user", "content": prompt}]
        return self.llm_client.chat(messages)
