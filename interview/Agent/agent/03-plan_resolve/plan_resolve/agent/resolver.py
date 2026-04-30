"""
答案整合器 - 根据执行结果生成最终答案

Resolver 是 Agent 流程的最后一步：
1. 接收问题 + 各步骤执行结果
2. 构建整合 Prompt
3. 调用 LLM 生成连贯的最终答案
"""

from typing import Callable

from ..llm.client import LLMClient
from ..prompts import render_resolver_prompt


class Resolver:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def resolve(
        self,
        question: str,
        steps_text: str,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        """
        根据执行结果生成最终答案

        输入：
        - question: 原始用户问题
        - steps_text: 格式化后的步骤执行结果
        """
        prompt = render_resolver_prompt(question, steps_text)
        messages = [{"role": "user", "content": prompt}]
        return self.llm_client.chat(
            messages=messages,
            stream=stream,
            on_token=on_token,
        )
