import re
from typing import Callable

from ..schemas.plan import Plan, StepResult
from ..tools.executor import ToolExecutor
from .parser import PlanParser
from .planner import Planner
from .resolver import Resolver
from .step_reasoner import StepReasoner


class PlanResolveAgent:
    def __init__(
        self,
        planner: Planner,
        resolver: Resolver,
        tool_executor: ToolExecutor,
        step_reasoner: StepReasoner,
    ):
        self.planner = planner
        self.resolver = resolver
        self.tool_executor = tool_executor
        self.step_reasoner = step_reasoner

    def run(
        self,
        question: str,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        print("--- 开始处理问题 ---")
        print(f"问题: {question}")
        print("--- 正在生成计划 ---")

        tools_desc = self.tool_executor.registry.describe_tools()
        print(f"🧠 正在调用 {self.planner.llm_client.config.model} 模型...")
        plan_text = self.planner.make_plan(
            question=question,
            tools_desc=tools_desc,
            stream=stream,
            on_token=on_token,
        )

        plan = PlanParser().parse_steps(plan_text, question)
        if not plan.steps:
            return "Unable to generate a valid execution plan."

        rendered_plan = self._render_plan_preview(plan)
        print("✅ 大语言模型响应成功:")
        print("✅ 计划已生成:")
        print("```python")
        print(rendered_plan)
        print("```")
        print()
        print("--- 正在执行计划 ---")
        print()

        step_results: list[StepResult] = []
        total_steps = len(plan.steps)
        for index, step in enumerate(plan.steps, start=1):
            print(f"-> 正在执行步骤 {index}/{total_steps}: {step.content}")

            # 若有工具则执行工具
            if step.executor == "tool" and step.tool_name and step.tool_input:
                print(f"🔧 正在调用工具 {step.tool_name}...")
                result = self.tool_executor.execute(step.tool_name, step.tool_input)
                clean_result = self._clean_inline_text(result.output)
                print("✅ 工具执行成功:")
                print(clean_result)
                step_results.append(
                    StepResult(
                        step_id=step.step_id,
                        content=step.content,
                        result=clean_result,
                        success=result.success,
                        executor=step.executor,
                    )
                )
                print(f"✅ 步骤 {index} 已完成，结果: {clean_result}")
                print()
                continue


            # 若没有工具则执行 模型调用
            # 获取上一步的结果并格式
            prior_results = self._format_results(step_results) if step_results else "(none)"
            print(f"🧠 正在调用 {self.step_reasoner.llm_client.config.model} 模型...")
            result_text = self.step_reasoner.run_step(
                question=question,
                step_content=step.content,
                previous_results=prior_results,
                stream=stream,
                on_token=on_token,
            )
            clean_result = self._clean_inline_text(result_text)
            print("✅ 大语言模型响应成功:")
            print(clean_result)
            step_results.append(
                StepResult(
                    step_id=step.step_id,
                    content=step.content,
                    result=clean_result,
                    success=True,
                    executor=step.executor,
                )
            )
            print(f"✅ 步骤 {index} 已完成")
            print()

        steps_text = self._format_results(step_results)
        final_answer = self.resolver.resolve(
            question=question,
            steps_text=steps_text,
            stream=False,
            on_token=None,
        )
        final_answer = self._clean_inline_text(final_answer)

        print("--- 任务完成 ---")
        print(f"最终答案: {final_answer}")
        return final_answer

    def _render_plan_preview(self, plan: Plan) -> str:
        return repr([step.content for step in plan.steps])

    def _clean_inline_text(self, text: str) -> str:
        text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r"<think>.*$", "", text, flags=re.DOTALL | re.IGNORECASE)
        return " ".join(text.strip().split())

    def _format_results(self, results: list[StepResult]) -> str:
        lines: list[str] = []
        for result in results:
            status = "OK" if result.success else "ERROR"
            lines.append(
                f"[Step {result.step_id}] {status} [{result.executor}] {result.content}"
            )
            lines.append(f"Result: {result.result}")
        return "\n".join(lines)
