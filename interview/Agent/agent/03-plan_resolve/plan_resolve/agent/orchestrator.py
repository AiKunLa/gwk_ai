"""
Plan-and-Resolve Agent 核心编排器

该模块实现了 ReAct (Reasoning + Acting) 模式的核心流程：
1. Planner 生成计划 → 2. Parser 解析计划 → 3. Executor 执行工具 → 4. Resolver 整合答案

设计要点：
- 解耦：规划、解析、执行、整合各自独立
- 结构化：工具调用使用显式字段而非自然语言正则匹配
- 容错：Parser 对 LLM 输出做多层容错处理
"""

from typing import Callable

from ..schemas.plan import StepResult
from ..tools.executor import ToolExecutor
from .parser import PlanParser
from .planner import Planner
from .resolver import Resolver


class PlanResolveAgent:
    """主 Agent 编排器，协调 Planning → Parsing → Execution → Resolution 全流程"""
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
        """
        执行 Agent 主流程

        流程：
        1. Planner.make_plan → 生成结构化计划文本
        2. PlanParser.parse_steps → 解析为 Plan 对象
        3. 遍历步骤，执行需要工具调用的步骤
        4. Resolver.resolve → 根据执行结果生成最终答案
        """
        # Step 1: 获取可用工具描述，让 Planner 知道可以调用哪些工具
        tools_desc = self.tool_executor.registry.describe_tools()

        # Step 2: Planner 生成计划（可能包含 <thinking> 标签）
        plan_text = self.planner.make_plan(
            question=question,
            tools_desc=tools_desc,
            stream=stream,
            on_token=on_token,
        )

        # Step 3: Parser 解析 LLM 输出，支持多种容错策略
        plan = PlanParser().parse_steps(plan_text, question)
        if not plan.steps:
            return "Unable to generate a valid execution plan."

        # Step 4: 执行每个计划步骤
        step_results: list[StepResult] = []
        for step in plan.steps:
            # 如果步骤需要工具调用，则执行它
            if step.use_tool and step.tool_name and step.tool_input:
                result = self.tool_executor.execute(step.tool_name, step.tool_input)
                step_results.append(
                    StepResult(
                        step_id=step.step_id,
                        content=step.content,
                        result=result.output,
                        success=result.success,
                    )
                )
                continue

            # 不需要工具调用的步骤（如总结）直接记录
            step_results.append(
                StepResult(
                    step_id=step.step_id,
                    content=step.content,
                    result="(no execution needed)",
                    success=True,
                )
            )

        # Step 5: 将执行结果格式化为文本，交给 Resolver 生成最终答案
        steps_text = self._format_results(step_results)
        return self.resolver.resolve(
            question=question,
            steps_text=steps_text,
            stream=stream,
            on_token=on_token,
        )

    def _format_results(self, results: list[StepResult]) -> str:
        lines: list[str] = []
        for result in results:
            status = "OK" if result.success else "ERROR"
            lines.append(f"[Step {result.step_id}] {status} {result.content}")
            lines.append(f"Result: {result.result}")
        return "\n".join(lines)
