import ast
import json
import re

from ..schemas.plan import Plan, PlanStep


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
                    if escape:
                        escape = False
                    elif char == "\\":
                        escape = True
                    elif char == quote_char:
                        in_string = False
                    continue

                if char in {'"', "'"}:
                    in_string = True
                    quote_char = char
                    continue

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
            executor = "tool" if tool_name and tool_input else "llm"
            steps.append(
                PlanStep(
                    step_id=index,
                    content=content,
                    executor=executor,
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
            executor = self._normalize_executor(item, tool_name, tool_input)
            return PlanStep(
                step_id=int(item.get("step_id", default_step_id)),
                content=content,
                executor=executor,
                tool_name=str(tool_name).strip() if tool_name else None,
                tool_input=str(tool_input).strip() if tool_input else None,
            )

        if isinstance(item, str):
            content = item.strip()
            if not content:
                return None

            tool_name, tool_input = self._extract_legacy_tool_call(content)
            executor = "tool" if tool_name and tool_input else "llm"
            return PlanStep(
                step_id=default_step_id,
                content=content,
                executor=executor,
                tool_name=tool_name,
                tool_input=tool_input,
            )

        return None

    def _normalize_executor(
        self,
        item: dict,
        tool_name: object,
        tool_input: object,
    ) -> str:
        executor = str(item.get("executor", "")).strip().lower()
        if executor in {"tool", "llm", "final"}:
            return executor

        use_tool = bool(item.get("use_tool")) or bool(tool_name and tool_input)
        return "tool" if use_tool else "llm"

    def _extract_legacy_tool_call(self, content: str) -> tuple[str | None, str | None]:
        match = re.search(r"(\w+)\[(.+?)\]", content)
        if not match:
            return None, None
        return match.group(1), match.group(2)
