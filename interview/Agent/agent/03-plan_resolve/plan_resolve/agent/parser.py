import ast
import json
import re

from ..schemas.plan import Plan, PlanStep


"""
LLM 输出解析器 - 将非结构化文本转为结构化 Plan

核心挑战：LLM 输出不可控，可能包含：
1. <thinking> 标签内的思考过程
2. Markdown 代码块包裹的 JSON
3. 纯 JSON 数组
4. 自然语言夹杂工具调用语法

解析策略（多层容错）：
1. 优先提取代码块内容
2. 剥离 <thinking> 标签
3. 从混合文本中找第一个可解析的 JSON 数组
4. 最后退化为按行兜底解析
"""


class PlanParser:
    def parse_steps(self, text: str, question: str) -> Plan:
        try:
            normalized = self._extract_payload(text)
            items = self._load_items(normalized)
            steps = self._build_steps_from_items(items)
        except Exception:
            steps = self._build_steps_from_lines(text)

        return Plan(question=question, steps=steps)

    def _extract_payload(self, text: str) -> str:
        content = text.strip()

        block_match = re.search(r"```(?:json|python)?\s*(.*?)```", content, re.DOTALL)
        if block_match:
            return block_match.group(1).strip()

        content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL | re.IGNORECASE).strip()
        array_payload = self._extract_first_array(content)
        if array_payload is not None:
            return array_payload

        return content

    def _extract_first_array(self, text: str) -> str | None:
        """
        从文本中查找第一个可解析的 JSON 数组

        使用状态机解析：跟踪括号深度、字符串上下文、转义字符
        找到 [ 时开始计数，深度归零时检查是否可解析
        """
        for start in range(len(text)):
            if text[start] != "[":
                continue

            depth = 0
            in_string = False
            escape = False
            quote_char = ""

            for end in range(start, len(text)):
                char = text[end]

                if in_string:
                    # 字符串内：处理转义
                    if escape:
                        escape = False
                    elif char == "\\":
                        escape = True
                    elif char == quote_char:
                        in_string = False
                    continue

                # 检测字符串开始
                if char in {'"', "'"}:
                    in_string = True
                    quote_char = char
                    continue

                # 跟踪括号深度
                if char == "[":
                    depth += 1
                    continue

                if char == "]":
                    depth -= 1
                    if depth == 0:
                        candidate = text[start : end + 1].strip()
                        if self._can_parse_as_list(candidate):
                            return candidate
                        break

        return None

    def _can_parse_as_list(self, text: str) -> bool:
        """验证文本是否能被解析为列表（JSON 或 Python literal）"""
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            try:
                data = ast.literal_eval(text)
            except Exception:
                return False
        return isinstance(data, list)

    def _load_items(self, text: str) -> list:
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            data = ast.literal_eval(text)

        if not isinstance(data, list):
            raise ValueError("Planner output must be a list.")
        return data

    def _build_steps_from_items(self, items: list) -> list[PlanStep]:
        steps: list[PlanStep] = []
        for index, item in enumerate(items, start=1):
            step = self._build_step(item, index)
            if step is not None:
                steps.append(step)
        return steps

    def _build_steps_from_lines(self, text: str) -> list[PlanStep]:
        steps: list[PlanStep] = []
        for index, raw_line in enumerate(text.strip().splitlines(), start=1):
            content = raw_line.strip().strip(",")
            if not content or content.startswith("```") or content in {"[", "]"}:
                continue

            content = content.strip("\"'")
            tool_name, tool_input = self._extract_legacy_tool_call(content)
            steps.append(
                PlanStep(
                    step_id=index,
                    content=content,
                    use_tool=bool(tool_name and tool_input),
                    tool_name=tool_name,
                    tool_input=tool_input,
                )
            )
        return steps

    def _build_step(self, item: object, default_step_id: int) -> PlanStep | None:
        if isinstance(item, dict):
            content = str(item.get("content", "")).strip()
            if not content:
                return None

            tool_name = item.get("tool_name")
            tool_input = item.get("tool_input")
            use_tool = bool(item.get("use_tool")) or bool(tool_name and tool_input)
            return PlanStep(
                step_id=int(item.get("step_id", default_step_id)),
                content=content,
                use_tool=use_tool,
                tool_name=str(tool_name).strip() if tool_name else None,
                tool_input=str(tool_input).strip() if tool_input else None,
            )

        if isinstance(item, str):
            content = item.strip()
            if not content:
                return None

            tool_name, tool_input = self._extract_legacy_tool_call(content)
            return PlanStep(
                step_id=default_step_id,
                content=content,
                use_tool=bool(tool_name and tool_input),
                tool_name=tool_name,
                tool_input=tool_input,
            )

        return None

    def _extract_legacy_tool_call(self, content: str) -> tuple[str | None, str | None]:
        match = re.search(r"(\w+)\[(.+?)\]", content)
        if not match:
            return None, None
        return match.group(1), match.group(2)
