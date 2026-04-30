from typing import Callable

from ..llm.client import LLMClient
from ..schemas.plan import StepResult


class StepReasoner:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def run_step(
        self,
        question: str,
        step_content: str,
        previous_results: str,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        prompt = f"""
You are executing one step in a plan-and-resolve workflow.

User question:
{question}

Current step:
{step_content}

Results from previous steps:
{previous_results}

Complete only the current step. Return the result of this step only.
Do not output analysis tags like <think>.
"""
        messages = [{"role": "user", "content": prompt.strip()}]
        return self.llm_client.chat(
            messages=messages,
            stream=stream,
            on_token=on_token,
        )
