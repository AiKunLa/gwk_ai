from .base import ToolSpec
from .registry import ToolRegistry
from ..schemas.tool import ToolResult

class ToolExecutor:
    def __init__(self, registry: ToolRegistry):
        self.registry = registry

    # 执行工具
    def execute(self, tool_name: str, tool_input: str) -> ToolResult:
        tool_spec = self.registry.get(tool_name)
        if not tool_spec:
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=f"错误: 未找到工具 '{tool_name}'",
                success=False,
            )
        # 执行工具函数
        try:
            result = tool_spec.func(tool_input)
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=result,
                success=True,
            )
        # 捕获工具执行中的异常
        except Exception as e:
            return ToolResult(
                tool_name=tool_name,
                tool_input=tool_input,
                output=f"执行错误: {e}",
                success=False,
            )
