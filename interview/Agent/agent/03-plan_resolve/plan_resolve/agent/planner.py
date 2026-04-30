"""
规划器 - 负责调用 LLM 生成执行计划

Planner 是 Agent 流程的第一步：
1. 构建规划 Prompt（包含可用工具描述）
2. 调用 LLM 生成计划文本
3. 返回原始 LLM 输出（包含 <thinking> 标签等）
"""

from typing import Callable

from ..llm.client import LLMClient
from ..prompts import render_planner_prompt


class Planner:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def make_plan(
        self,
        question: str,
        tools_desc: str,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        """
        生成执行计划

        过程：
        1. 用 question 和 tools_desc 渲染 Prompt
        2. 发送给 LLM
        3. 返回 LLM 原始输出（可能包含 <thinking> 等）
        """
        prompt = render_planner_prompt(question, tools_desc)
        messages = [{"role": "user", "content": prompt}]
        return self.llm_client.chat(
            messages=messages,
            stream=stream,
            on_token=on_token,
        )
