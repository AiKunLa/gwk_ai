import re
from ..schemas.plan import Plan, PlanStep

class PlanParser:
    def parse_steps(self, text: str, question: str) -> Plan:
        steps = []
        lines = text.strip().split("\n")

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # 匹配 "步骤1: xxx" 或 "1. xxx" 格式
            match = re.match(r"^(?:步骤\s*)?(\d+)[:：]\s*(.+)", line)
            if match:
                step_id = int(match.group(1))
                content = match.group(2).strip()
                steps.append(PlanStep(step_id=step_id, content=content))

        # 如果解析失败，尝试简单按行分割
        if not steps:
            for i, line in enumerate(lines, 1):
                line = line.strip()
                if line and not line.startswith("-"):
                    steps.append(PlanStep(step_id=i, content=line))

        return Plan(question=question, steps=steps)
