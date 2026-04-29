from dataclasses import dataclass
from typing import Callable

@dataclass
class ToolSpec:
    name: str
    description: str
    func: Callable[[str], str]

@dataclass
class ToolCall:
    tool_name: str
    tool_input: str

@dataclass
class ToolResult:
    tool_name: str
    tool_input: str
    output: str
    success: bool
