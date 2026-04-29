from ..llm.client import LLMClient
from ..tools.registry import ToolRegistry
from ..tools.executor import ToolExecutor
from ..schemas.plan import Plan, StepResult
from .planner import Planner
from .parser import PlanParser
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

    def run(self, question: str) -> str:
        # 阶段1: 规划
        tools_desc = self.tool_executor.registry.describe_tools()
        plan_text = self.planner.make_plan(question, tools_desc)

        # 解析计划
        parser = PlanParser()
        plan = parser.parse_steps(plan_text, question)

        if not plan.steps:
            return "无法生成有效的执行计划"

        # 阶段2: 执行
        step_results: list[StepResult] = []

        for step in plan.steps:
            # 从步骤内容中提取工具调用
            tool_name, tool_input = self._extract_tool_call(step.content)

            if tool_name and tool_input:
                result = self.tool_executor.execute(tool_name, tool_input)
                step_results.append(StepResult(
                    step_id=step.step_id,
                    content=step.content,
                    result=result.output,
                    success=result.success,
                ))
            else:
                # 无工具调用的步骤，直接标记为完成
                step_results.append(StepResult(
                    step_id=step.step_id,
                    content=step.content,
                    result="(无需执行)",
                    success=True,
                ))

        # 阶段3: 汇总
        steps_text = self._format_results(step_results)
        final_answer = self.resolver.resolve(question, steps_text)

        return final_answer

    def _extract_tool_call(self, step_content: str) -> tuple[str | None, str | None]:
        """从步骤内容中提取工具名和参数"""
        import re
        match = re.search(r"(\w+)\[(.+?)\]", step_content)
        if match:
            return match.group(1), match.group(2)
        return None, None

    def _format_results(self, results: list[StepResult]) -> str:
        lines = []
        for r in results:
            status = "✓" if r.success else "✗"
            lines.append(f"[步骤{r.step_id}] {r.content}")
            lines.append(f"  结果: {r.result}")
        return "\n".join(lines)
