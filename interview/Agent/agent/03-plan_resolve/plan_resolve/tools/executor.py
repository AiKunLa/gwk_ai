"""
工具执行器 - 负责调用注册表中的工具并返回执行结果

职责：
1. 根据 tool_name 从注册表查找工具
2. 调用工具函数并捕获异常
3. 包装执行结果为统一的 ToolResult 格式
"""

from .registry import ToolRegistry
from ..schemas.tool import ToolResult


class ToolExecutor:
    def __init__(self, registry: ToolRegistry):
        self.registry = registry

    def execute(self, tool_name: str, tool_input: str) -> ToolResult:
        """
        执行指定工具

        两阶段错误处理：
        1. 查找阶段失败 → 工具未注册或名称错误
        2. 执行阶段失败 → 工具内部异常
        """
        # 阶段1: 从注册表查找工具
        try:
            tool_spec = self.registry.get_tool(tool_name)
        except Exception as exc:
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=f"Tool lookup error: {exc}",
                success=False,
            )

        # 阶段2: 调用工具函数
        try:
            result = tool_spec.func(tool_input)
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=result,
                success=True,
            )
        except Exception as exc:
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=f"Tool execution error: {exc}",
                success=False,
            )
