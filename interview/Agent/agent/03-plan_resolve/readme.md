# Plan-and-Resolve Agent

这是一个两阶段的 Agent 示例：先规划，再执行，最后汇总。

## 目标

这个项目解决的是一类常见问题：用户的问题需要多步处理，而且其中一部分步骤必须调用外部工具，不能让模型自己猜。

相比把“思考”和“执行”混在一起的单回合 Agent，这个项目把链路拆成三段：

1. `Planner` 负责生成执行计划。
2. `ToolExecutor` 负责执行计划中的工具步骤。
3. `Resolver` 负责基于步骤结果生成最终答案。

这样做的原因很直接：

- 规划阶段需要全局视角，重点是“该做哪些步骤”。
- 执行阶段需要确定性，重点是“哪些步骤要调工具，工具入参是什么”。
- 汇总阶段需要语言组织，重点是“如何把结果说清楚”。

## 目录结构

```text
03-plan_resolve/
├─ run.py
├─ .env
├─ readme.md
└─ plan_resolve/
   ├─ agent/
   │  ├─ orchestrator.py
   │  ├─ parser.py
   │  ├─ planner.py
   │  └─ resolver.py
   ├─ llm/
   │  ├─ client.py
   │  └─ config.py
   ├─ prompts/
   │  ├─ planner.py
   │  ├─ renderer.py
   │  └─ resolver.py
   ├─ schemas/
   │  ├─ plan.py
   │  └─ tool.py
   └─ tools/
      ├─ base.py
      ├─ executor.py
      ├─ registry.py
      └─ builtin/
         └─ search.py
```

## 模块职责

### `llm/`

只负责模型调用，不关心 Prompt 拼接、工具执行、计划解析。

核心接口：

```python
LLMClient.chat(messages, temperature=0, stream=False, on_token=None) -> str
```

这样做的原因：

- 让“是否流式输出”成为调用策略，而不是业务逻辑。
- 避免 `Planner` 和 `Resolver` 自己处理 token 输出。

### `prompts/`

只负责 Prompt 模板和渲染。

这样做的原因：

- Prompt 经常调整，把它和业务逻辑拆开更容易迭代。
- 规划提示词和汇总提示词职责不同，分文件更清楚。

### `schemas/`

只负责结构化数据定义。

当前计划结构：

```python
@dataclass
class PlanStep:
    step_id: int
    content: str
    use_tool: bool = False
    tool_name: str | None = None
    tool_input: str | None = None
```

这样做的原因：

- 不再依赖从自然语言里二次猜测工具调用。
- `Planner -> Parser -> Orchestrator` 三层共享同一份协议。

### `tools/`

拆成三层：

- `registry.py`：管理有哪些工具
- `executor.py`：执行某个具体工具
- `builtin/`：放具体工具实现

这样做的原因：

- 工具注册和工具执行是两类职责，混在一起后面很难扩展。
- 新增工具时只需要增加实现并注册，不需要改执行框架。

### `agent/`

- `planner.py`：向模型请求“计划”
- `parser.py`：把模型输出解析为 `Plan`
- `orchestrator.py`：按 `Plan` 执行
- `resolver.py`：基于步骤结果生成最终答案

这样做的原因：

- 规划、解析、编排、汇总是四种不同责任，拆开后更容易定位问题。

## 当前工作流

```text
user question
  -> Planner.make_plan()
  -> LLMClient.chat()
  -> PlanParser.parse_steps()
  -> for step in plan.steps:
       if step.use_tool:
         ToolExecutor.execute(step.tool_name, step.tool_input)
  -> Resolver.resolve()
  -> final answer
```

## 这次为什么要改

这次修改不是简单“换一种写法”，而是修复了一条真实会失效的链路。

### 原来的问题 1：Prompt、Parser、Executor 三层协议不一致

原来 `planner` 让模型输出“步骤列表”，但执行层真正需要的是：

- 这一步是否调用工具
- 调哪个工具
- 工具入参是什么

如果这些信息不显式结构化，系统只能再从自然语言里用正则去猜，比如猜 `Search[...]`。这会很脆弱。

所以现在把计划输出固定成 JSON：

```json
[
  {
    "step_id": 1,
    "content": "搜索苹果 iPhone 17 的主要亮点",
    "use_tool": true,
    "tool_name": "Search",
    "tool_input": "苹果 iPhone 17 主要亮点"
  }
]
```

这样做的原因：

- 模型负责“声明意图”
- 程序负责“机械执行”
- 不再让程序去理解模糊自然语言

### 原来的问题 2：模型虽然输出了工具计划，但 Parser 没正确取到

这次真实输出里，模型在 JSON 数组前面额外输出了：

```text
<think> ... </think>
```

也就是说，实际返回不是纯 JSON，而是：

```text
<think>...</think>
[
  {...}
]
```

原来的 `PlanParser` 会优先尝试把整段文本直接当成 JSON 或 Python 列表解析。由于前面混入了 `<think>`，解析会失败，然后退回“按行拆文本”的兜底逻辑。

一旦进入按行兜底，原来的结构化字段就丢了，结果就会变成：

- `content` 变成零散文本行
- `use_tool / tool_name / tool_input` 无法恢复
- `orchestrator` 认为这些步骤都不是工具步骤
- 最后模型继续自己推测，没有真正调用工具

这就是为什么你看到“模型明明写了 Search，但工具还是没调”。

### 原来的问题 3：工具执行层还有接口名不一致的问题

之前 `ToolExecutor` 调的是：

```python
registry.get(...)
```

而注册表实际提供的是：

```python
registry.get_tool(...)
```

这意味着即使前面识别出了工具步骤，执行阶段也可能直接失败。

## 这次具体改了什么

### 1. 统一计划协议

`PlanStep` 增加了这几个字段：

- `use_tool`
- `tool_name`
- `tool_input`

这样 `Planner` 输出、`Parser` 解析、`Orchestrator` 执行三层使用同一份数据结构。

### 2. 强化 Planner Prompt

现在的规划 Prompt 明确要求：

- 只能输出 JSON 数组
- 禁止输出 `<think>`
- 禁止输出解释、Markdown、代码块外内容
- 输出必须以 `[` 开始，以 `]` 结束

这样做的原因：

- 减少模型“多说话”的概率
- 尽量让返回值天然适合机器解析

### 3. 强化 Parser 的鲁棒性

现在 `PlanParser` 的解析顺序是：

1. 先找代码块里的内容
2. 再剥掉 `<think>...</think>`
3. 再从混合文本里提取第一个可解析的数组
4. 解析失败时，最后才退回到按行兜底

这样做的原因：

- 模型输出并不总是完全听话
- 程序需要对“半结构化但接近正确”的输出有容错能力

### 4. Orchestrator 不再靠正则猜工具调用

现在执行时直接读：

```python
step.use_tool
step.tool_name
step.tool_input
```

而不是再从 `content` 里抓 `Search[...]`。

这样做的原因：

- 工具执行依赖显式字段，比自然语言正则更稳定

### 5. 修正工具执行器

`ToolExecutor` 现在统一通过：

```python
registry.get_tool(tool_name)
```

这样做的原因：

- 消除接口名不一致导致的隐藏执行失败

## 为什么修改后仍可能看到模型“在想”

如果当前所用模型会把思维过程以 `<think>` 的形式直接输出到 `content`，即使 Prompt 禁止，也不一定 100% 遵守。

所以正确策略不是“只相信 Prompt 会约束住模型”，而是：

1. Prompt 尽量约束
2. Parser 对真实输出做容错清洗

这也是这次修改最关键的设计点。

## 新增工具的方法

```python
from ..base import ToolSpec

def my_tool_impl(query: str) -> str:
    return f"result: {query}"

my_tool = ToolSpec(
    name="MyTool",
    description="My custom tool",
    func=my_tool_impl,
)
```

然后在 `run.py` 中注册：

```python
registry.register_tool(my_tool)
```

## 面试时可以怎么讲

可以重点讲这几个点：

1. 为什么要把规划和执行拆开
2. 为什么工具调用必须结构化，而不能靠自然语言再猜
3. 为什么 Parser 必须对模型输出做容错
4. 为什么 `LLMClient` 只负责调用，不负责业务逻辑
5. 为什么 `registry / executor / builtin` 要分层

一句话总结：

这个项目真正解决的不是“怎么让模型写计划”，而是“怎么把模型计划可靠地变成可执行动作”。
