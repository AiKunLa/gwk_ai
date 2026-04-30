"""
工具基类定义

ToolSpec 是工具的规格描述，用于注册到 ToolRegistry
"""

from dataclasses import dataclass
from typing import Callable


@dataclass
class ToolSpec:
    """
    工具规格

    属性：
    - name: 工具名称
    - description: 工具描述（用于 LLM 理解何时调用）
    - func: 工具函数，签名为 (str) -> str
    """

    name: str
    description: str
    func: Callable[[str], str]
