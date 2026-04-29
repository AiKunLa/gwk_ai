from typing import Any
from .planner import PLANNER_PROMPT_TEMPLATE
from .resolver import RESOLVER_PROMPT_TEMPLATE

class PromptRenderer:
    """统一 Prompt 渲染器，避免业务层直接拼接字符串"""

    @staticmethod
    def render_planner(question: str, tools: str) -> str:
        """
        渲染规划阶段 Prompt
        Args:
            question: 用户问题
            tools: 可用工具描述字符串
        Returns:
            格式化后的 prompt
        """
        return PLANNER_PROMPT_TEMPLATE.format(question=question, tools=tools)

    @staticmethod
    def render_resolver(question: str, steps_text: str) -> str:
        """
        渲染汇总阶段 Prompt
        Args:
            question: 用户问题
            steps_text: 各步骤执行结果的文本描述
        Returns:
            格式化后的 prompt
        """
        return RESOLVER_PROMPT_TEMPLATE.format(
            question=question,
            steps_text=steps_text,
        )

    @staticmethod
    def render(question: str, template_name: str, **kwargs: Any) -> str:
        """
        通用渲染接口
        Args:
            question: 用户问题
            template_name: 模板名称 (planner | resolver)
            **kwargs: 其他模板变量
        Returns:
            格式化后的 prompt
        """
        if template_name == "planner":
            return PLANNER_PROMPT_TEMPLATE.format(question=question, **kwargs)
        elif template_name == "resolver":
            return RESOLVER_PROMPT_TEMPLATE.format(question=question, **kwargs)
        else:
            raise ValueError(f"Unknown template: {template_name}")
