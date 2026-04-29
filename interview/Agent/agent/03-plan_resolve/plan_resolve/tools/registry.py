from .base import ToolSpec

class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, ToolSpec] = {}
    
    # 注册工具
    def register_tool(self, tool_spec: ToolSpec)-> None:
        if tool_spec.name in self._tools:
            raise ValueError(f"Tool with name '{tool_spec.name}' is already registered.")
        self._tools[tool_spec.name] = tool_spec
        
    # 获取工具
    def get_tool(self, name: str) -> ToolSpec:
        if name not in self._tools:
            raise ValueError(f"Tool with name '{name}' is not registered.")
        return self._tools[name]
    
    # 获取所有工具的描述
    def describe_tools(self) -> str:
        descriptions = []
        for tool in self._tools.values():
            descriptions.append(f"{tool.name}: {tool.description}")
        return "\n".join(descriptions)
    
    @property
    def tools(self) -> dict[str, ToolSpec]:
        return self._tools