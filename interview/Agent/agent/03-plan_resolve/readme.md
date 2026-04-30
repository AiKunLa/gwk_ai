# Plan-and-Resolve Agent

两阶段规划的 Agent 实现：**先拆解计划，再执行汇总**。

---

## 核心思想

传统 Agent（如 ReAct）是「边想边调工具」，每一步都混合了推理和执行。
Plan-and-Resolve 的思路是**两阶段分离**：

1. **规划阶段（Plan）** - 让 LLM 一次性生成完整计划
2. **执行+汇总阶段（Resolve）** - 按计划执行，汇总结果

适合**多步骤、可独立执行**的任务，如调研、对比分析、攻略生成。

---

## 目录结构

```
03-plan_resolve/
├─ run.py                      # 入口，组装所有组件
├─ .env                        # 配置（API Key 等）
│
├─ plan_resolve/
│  ├─ agent/                   # Agent 核心逻辑
│  │  ├─ planner.py           # 调用 LLM 生成计划
│  │  ├─ parser.py            # 解析 LLM 输出为结构化 Plan
│  │  ├─ resolver.py          # 汇总执行结果生成最终答案
│  │  └─ orchestrator.py      # 总编排器，串起各组件
│  │
│  ├─ llm/                     # LLM 调用层
│  │  ├─ config.py            # 配置读取（model/api_key/base_url/timeout）
│  │  └─ client.py            # 统一模型调用入口
│  │
│  ├─ prompts/                 # Prompt 模板层
│  │  ├─ planner.py           # 规划阶段系统 Prompt
│  │  ├─ resolver.py          # 汇总阶段系统 Prompt
│  │  └─ renderer.py          # 统一渲染器，避免字符串拼接
│  │
│  ├─ tools/                   # 工具层
│  │  ├─ base.py              # ToolSpec 数据结构
│  │  ├─ registry.py          # 工具注册中心
│  │  ├─ executor.py          # 工具执行器
│  │  └─ builtin/
│  │     └─ search.py         # 搜索工具实现
│  │
│  └─ schemas/                 # 数据结构层
│     ├─ plan.py              # Plan / PlanStep / StepResult
│     └─ tool.py              # ToolCall / ToolResult
│
└─ tests/


模块之间的调用关系

run.py
  -> PlanResolveAgent.run(question)
    -> Planner.make_plan(question)
      -> render_planner_prompt()
      -> LLMClient.chat()
      -> PlanParser.parse_steps()
    -> ToolExecutor.execute(...) / 或直接执行 step handler
    -> Resolver.resolve(question, step_results)
      -> render_resolver_prompt()
      -> LLMClient.chat()

```

---

## 模块职责

### `llm/` - 边界清晰，只管「输入 messages 输出文本」

```python
class LLMClient:
    def chat(self, messages: list[dict], temperature: float = 0) -> str
```

不关心 Prompt 怎么拼、不关心工具是什么。

### `prompts/` - 边界清晰，只管「输入业务数据，输出 Prompt 字符串」

```python
PromptRenderer.render_planner(question, tools_desc) -> str
PromptRenderer.render_resolver(question, steps_text) -> str
```

不直接调用 LLM，职责单一。

### `schemas/` - 用 dataclass 定义结构

- `Plan` / `PlanStep` / `StepResult` - 规划相关
- `ToolCall` / `ToolResult` - 工具调用相关

**好处**：后续不传裸 dict/str，整个链路类型安全。

### `tools/` - 工具层分离

| 组件 | 职责 |
|------|------|
| `registry` | 只管「有哪些工具」 |
| `executor` | 只管「怎么执行工具」 |
| `builtin/search` | 具体工具实现，不涉及执行逻辑 |

**关键原则**：registry 不执行、executor 不保存 Prompt。

### `agent/` - 编排逻辑

| 组件 | 职责 |
|------|------|
| `planner` | 调用 LLM 生成计划文本 |
| `parser` | 解析文本 → `Plan` 结构 |
| `resolver` | 调用 LLM 汇总结果 |
| `orchestrator` | 串起所有组件，提供 `run()` 入口 |

---

## 执行流程

```
用户问题
    │
    ▼
┌─────────────────────────────────────────────┐
│  阶段一：规划                                 │
│  Planner.make_plan()                        │
│    → PromptRenderer.render_planner()        │
│    → LLMClient.chat()                       │
│    → PlanParser.parse_steps() → Plan        │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  阶段二：执行                                │
│  for step in Plan.steps:                    │
│    → ToolExecutor.execute(tool_name, input) │
│    → StepResult                             │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  阶段三：汇总                                 │
│  Resolver.resolve()                         │
│    → PromptRenderer.render_resolver()       │
│    → LLMClient.chat()                       │
│    → 最终答案                                │
└─────────────────────────────────────────────┘
```

---

## 与 ReAct 的区别

| | ReAct | Plan-and-Resolve |
|---|---|---|
| 推理方式 | 边想边调，每步混合 | 先想好再执行，两阶段分离 |
| 计划性 | 弱，容易走一步看一步 | 强，一次性规划全局 |
| 适用场景 | 探索性任务 | 多步骤、结构化任务 |
| LLM 调用 | 多次（小步骤） | 3 次（规划/执行记录/汇总） |

---

## 扩展方式

### 新增工具

```python
# plan_resolve/tools/builtin/my_tool.py
from ..schemas.tool import ToolSpec

def my_tool_impl(query: str) -> str:
    return f"处理结果: {query}"

my_tool = ToolSpec(
    name="MyTool",
    description="我的工具",
    func=my_tool_impl,
)

# 在 run.py 中注册
registry.register(my_tool)
```

### 新增 Prompt 模板

在 `prompts/` 下新增文件，在 `renderer.py` 添加渲染方法即可。

---

## 面试要点

1. **分层架构** - 每一层边界清晰，职责单一（LLM 只管调用、Prompt 只管渲染、工具只管执行）
2. **两阶段设计** - 为什么分离？因为规划阶段 LLM 需要全局视野，执行阶段需要细粒度控制
3. **dataclass 替代 dict** - 类型安全、可读性、可维护性
4. **工具注册与执行分离** - 便于扩展、便于测试、单一职责
5. **PromptRenderer** - 避免业务层直接拼接字符串，集中管理
6. **对比 ReAct** - 两种范式适用场景不同，Plan-and-Resolve 更适合结构化任务
