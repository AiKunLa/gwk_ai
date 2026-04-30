from typing import Any

from .planner import PLANNER_PROMPT_TEMPLATE
from .resolver import RESOLVER_PROMPT_TEMPLATE


class PromptRenderer:
    @staticmethod
    def render_planner(question: str, tools: str) -> str:
        return PLANNER_PROMPT_TEMPLATE.format(question=question, tools=tools)

    @staticmethod
    def render_resolver(question: str, steps_text: str) -> str:
        return RESOLVER_PROMPT_TEMPLATE.format(
            question=question,
            steps_text=steps_text,
        )

    @staticmethod
    def render(question: str, template_name: str, **kwargs: Any) -> str:
        if template_name == "planner":
            return PLANNER_PROMPT_TEMPLATE.format(question=question, **kwargs)
        if template_name == "resolver":
            return RESOLVER_PROMPT_TEMPLATE.format(question=question, **kwargs)
        raise ValueError(f"Unknown template: {template_name}")
