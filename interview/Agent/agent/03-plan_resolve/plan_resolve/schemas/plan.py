"""
Plan 数据结构定义

核心数据结构：
- PlanStep: 单个计划步骤
- Plan: 完整计划（问题 + 步骤列表）
- StepResult: 步骤执行结果

设计要点：
- 使用 dataclass 而非 dict，提高类型安全和可读性
- step_id 从 1 开始，便于人类阅读
- use_tool/tool_name/tool_input 三字段确保工具调用结构化
"""

from dataclasses import dataclass, field


@dataclass
class PlanStep:
    """单个计划步骤"""

    step_id: int
    content: str  # 步骤描述
    use_tool: bool = False  # 是否需要工具调用
    tool_name: str | None = None  # 工具名称（Search 等）
    tool_input: str | None = None  # 工具输入参数


@dataclass
class Plan:
    """完整执行计划"""

    question: str  # 原始用户问题
    steps: list[PlanStep] = field(default_factory=list)  # 步骤列表


@dataclass
class StepResult:
    """步骤执行结果"""

    step_id: int
    content: str  # 步骤描述（来自 PlanStep）
    result: str  # 执行输出
    success: bool  # 是否执行成功
