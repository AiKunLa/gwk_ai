from dataclasses import dataclass, field

@dataclass
class PlanStep:
    step_id: int
    content: str

@dataclass
class Plan:
    question: str
    steps: list[PlanStep] = field(default_factory=list)

@dataclass
class StepResult:
    step_id: int
    content: str
    result: str
    success: bool
