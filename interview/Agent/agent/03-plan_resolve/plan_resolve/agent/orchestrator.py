import re
from typing import Callable

from ..schemas.plan import StepResult
from ..tools.executor import ToolExecutor
from .parser import PlanParser
from .planner import Planner
from .resolver import Resolver


class PlanResolveAgent:
    def __init__(
        self,
        planner: Planner,
        resolver: Resolver,
        tool_executor: ToolExecutor,
    ):
        self.planner = planner
        self.resolver = resolver
        self.tool_executor = tool_executor

    def run(
        self,
        question: str,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        # 获取工具描述
        tools_desc = self.tool_executor.registry.describe_tools()
        
        print(f'工具：{tools_desc}')
        
        plan_text = self.planner.make_plan(
            question=question,
            tools_desc=tools_desc,
            stream=stream,
            on_token=on_token,
        )

        parser = PlanParser()
        # 生成计划
        plan = parser.parse_steps(plan_text, question)
        if not plan.steps:
            return "Unable to generate a valid execution plan."

        step_results: list[StepResult] = []
        for step in plan.steps:
            tool_name, tool_input = self._extract_tool_call(step.content)

            if tool_name and tool_input:
                result = self.tool_executor.execute(tool_name, tool_input)
                step_results.append(
                    StepResult(
                        step_id=step.step_id,
                        content=step.content,
                        result=result.output,
                        success=result.success,
                    )
                )
                continue

            step_results.append(
                StepResult(
                    step_id=step.step_id,
                    content=step.content,
                    result="(no execution needed)",
                    success=True,
                )
            )

        steps_text = self._format_results(step_results)
        return self.resolver.resolve(
            question=question,
            steps_text=steps_text,
            stream=stream,
            on_token=on_token,
        )

    def _extract_tool_call(self, step_content: str) -> tuple[str | None, str | None]:
        match = re.search(r"(\w+)\[(.+?)\]", step_content)
        if match:
            return match.group(1), match.group(2)
        return None, None

    def _format_results(self, results: list[StepResult]) -> str:
        lines: list[str] = []
        for result in results:
            status = "OK" if result.success else "ERROR"
            lines.append(f"[Step {result.step_id}] {status} {result.content}")
            lines.append(f"Result: {result.result}")
        return "\n".join(lines)
