from ..llm.client import LLMClient
from ..prompts import render_resolver_prompt

class Resolver:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def resolve(self, question: str, steps_text: str) -> str:
        prompt = render_resolver_prompt(question, steps_text)
        messages = [{"role": "user", "content": prompt}]
        return self.llm_client.chat(messages)
