from dataclasses import dataclass
from typing import Callable

@dataclass
class ToolSpec:
    name: str
    description: str
    func: Callable[[str], str]
