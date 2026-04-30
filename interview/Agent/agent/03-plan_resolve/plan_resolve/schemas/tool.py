"""
Tool 数据结构定义

ToolSpec: 工具规格（用于注册）
ToolResult: 工具执行结果（用于返回）
"""

from dataclasses import dataclass
from typing import Callable


@dataclass
class ToolSpec:
    """
    工具规格定义

    - name: 工具名称，用于调用
    - description: 工具描述，用于 Prompt 构建
    - func: 工具实现，签名为 (str) -> str
    """

    name: str
    description: str
    func: Callable[[str], str]


@dataclass
class ToolCall:
    """
    工具调用请求（预留，当前通过 PlanStep 传递）
    """

    tool_name: str
    tool_input: str


@dataclass
class ToolResult:
    """
    工具执行结果

    - tool_name: 被调用的工具名
    - tool_input: 传递给工具的输入
    - output: 工具返回的文本
    - success: 执行是否成功
    """

    tool_name: str
    tool_input: str
    output: str
    success: bool
