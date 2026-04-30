# Plan-and-Resolve Agent

这是一个分阶段执行的 Agent 示例。它不是让模型一边想一边随手调用工具，而是先生成计划，再按步骤类型执行，最后统一汇总。

## 设计目标

这个项目要解决的是一类典型问题：

- 有些步骤需要外部工具获取事实
- 有些步骤不需要工具，但仍需要模型进行中间思考
- 最后还需要把所有中间结果整理成最终答案

如果执行层只会“调工具”而不会“做中间推理”，那么很多计划虽然看起来完整，实际上中途会断掉。比如：

1. 搜索 iPhone 17 的亮点
2. 比较搜索结果并提炼重点
3. 生成最终回答

第 2 步不需要工具，但显然也不是空操作。它必须由 LLM 真正执行。

这就是这次改造的核心原因：`Plan-and-Resolve` 的执行层不能只支持工具，还必须支持 LLM 步骤。

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
   │  ├─ resolver.py
   │  └─ step_reasoner.py
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

## 核心模块职责

### `llm/`

只负责模型调用，不关心计划、工具、解析和编排。

核心接口：

```python
LLMClient.chat(messages, temperature=0, stream=False, on_token=None) -> str
```

这样做的原因：

- 流式输出属于调用策略，不属于业务逻辑
- `Planner`、`StepReasoner`、`Resolver` 都可以复用同一入口
- `<think>` 清洗统一收口在模型层，避免上层模块各自重复处理

### `prompts/`

只负责 Prompt 模板和渲染。

这样做的原因：

- 规划提示词、步骤执行提示词、汇总提示词是三种不同目标
- Prompt 经常迭代，独立出来更容易维护

### `schemas/`

只负责结构化数据定义。

当前的 `PlanStep` 协议是：

```python
@dataclass
class PlanStep:
    step_id: int
    content: str
    executor: str = "llm"
    tool_name: str | None = None
    tool_input: str | None = None
```

这里最关键的字段不再是 `use_tool`，而是 `executor`。

它表示这一步到底由谁执行：

- `executor="tool"`：交给工具执行
- `executor="llm"`：交给 LLM 执行中间思考
- `executor="final"`：保留给收束或特殊终结步骤

这样做的原因：

- `use_tool=True/False` 只能区分“调不调工具”
- 但真实执行时还需要区分“是不是要让 LLM 处理”
- `executor` 比布尔字段更能表达可扩展的执行语义

### `tools/`

拆成三层：

- `registry.py`：管理有哪些工具
- `executor.py`：执行某个工具
- `builtin/`：放具体工具实现

这样做的原因：

- 工具注册和工具执行不是同一种职责
- 后面新增工具时只需要增加实现并注册

### `agent/`

- `planner.py`：生成结构化计划
- `parser.py`：把模型输出解析成 `Plan`
- `step_reasoner.py`：执行非工具步骤
- `orchestrator.py`：调度整条计划
- `resolver.py`：汇总所有步骤结果生成最终答案

这样做的原因：

- “规划”
- “解析”
- “工具执行”
- “中间推理执行”
- “最终汇总”

这五件事本质上是不同职责，拆开后链路清晰很多。

## 当前工作流

```text
user question
  -> Planner.make_plan()
  -> LLMClient.chat()
  -> PlanParser.parse_steps()
  -> for step in plan.steps:
       if step.executor == "tool":
         ToolExecutor.execute(...)
       else:
         StepReasoner.run_step(...)
  -> Resolver.resolve()
  -> final answer
```

## 为什么要这样改

### 原问题 1：执行层只支持工具，不支持中间思考

之前的执行层逻辑是：

```python
if step.use_tool:
    execute_tool()
else:
    mark_as_no_execution_needed()
```

这在简单场景下勉强能跑，但在真实计划里会漏掉大量必要步骤。比如：

- 比较两个搜索结果
- 从多条结果中提炼共性
- 判断哪些信息和用户问题最相关
- 基于已有结果生成下一轮查询词

这些都不是工具步骤，但也不是“无需执行”。

如果把它们直接跳过，后面的 `Resolver` 只能基于残缺上下文去拼答案，模型就更容易自己猜。

所以现在的改法是：

- 工具步骤由 `ToolExecutor` 执行
- 思考步骤由 `StepReasoner` 执行

这才是完整的 `Plan-and-Resolve`。

### 原问题 2：计划协议表达力不够

旧协议大致是：

```python
use_tool: bool
tool_name: str | None
tool_input: str | None
```

它只能够回答一个问题：这一步要不要调工具。

但执行层真正需要回答的是：

- 这一步由工具执行还是由 LLM 执行
- 如果是工具执行，用哪个工具，输入是什么
- 如果是 LLM 执行，需要拿什么上下文做推理

所以协议升级成 `executor` 更合适。

### 原问题 3：模型输出不总是完全听话

前面已经遇到过真实情况：模型在 JSON 前面输出了 `<think>...</think>`。

如果 parser 只会对整段文本做 `json.loads`，那一失败就只能退回文本兜底，最后又把结构化字段丢掉。

所以 `parser.py` 现在做了两层事情：

1. 尽量清洗真实输出
2. 尽量恢复结构化计划

当前顺序是：

1. 先提取代码块内容
2. 再剥掉 `<think>...</think>`
3. 再从混合输出中提取第一个可解析数组
4. 都失败时才退回按行兜底

这样做的原因：

- Prompt 只能降低偏航概率，不能假设模型 100% 服从
- Parser 必须具备对真实输出的容错能力

## 这次具体改了什么

### 1. `PlanStep` 从 `use_tool` 升级为 `executor`

现在计划不再只表达“要不要工具”，而是表达“这一步由谁执行”。

好处：

- 语义更完整
- 执行流更清晰
- 后面可扩展性更强

### 2. 新增 `StepReasoner`

新增文件：

[`step_reasoner.py`](/D:/Code/Trae_Project/gwk_ai/interview/Agent/agent/03-plan_resolve/plan_resolve/agent/step_reasoner.py)

它负责执行那些不需要工具、但需要模型完成的步骤。

输入包括：

- 原始用户问题
- 当前步骤描述
- 前序步骤结果

这样做的原因：

- 让每一步非工具任务都能拿到局部上下文
- 避免把所有中间推理都压到最后的 `Resolver`

### 3. `Orchestrator` 改成多执行器分发

现在的核心逻辑是：

```python
if step.executor == "tool":
    ToolExecutor.execute(...)
else:
    StepReasoner.run_step(...)
```

而不再是旧的：

```python
if step.use_tool:
    ...
else:
    "(no execution needed)"
```

这样做的原因：

- 真正执行所有计划步骤
- 保证步骤结果链条完整

### 4. `Planner` Prompt 明确输出 `executor`

现在规划 Prompt 会要求模型为每一步显式输出：

- `executor`
- `tool_name`
- `tool_input`

并且明确约束：

- 搜索、查询、验证类步骤要用 `executor="tool"`
- 比较、分析、归纳、总结类步骤要用 `executor="llm"`

这样做的原因：

- 让规划阶段直接产出可执行计划
- 避免运行时再从自然语言二次推测

### 5. `Parser` 兼容新旧协议

当前 parser 既支持新协议：

```json
{
  "executor": "tool"
}
```

也兼容旧字段：

```json
{
  "use_tool": true
}
```

兼容逻辑是：

- 如果有 `executor`，优先使用
- 如果没有，就回退到 `use_tool`

这样做的原因：

- 降低迁移过程中的脆弱性
- 旧输出格式还能被解释成合理计划

## 控制台输出格式

现在的控制台输出被统一成阶段化样式，例如：

```text
--- 开始处理问题 ---
问题: ...
--- 正在生成计划 ---
🧠 正在调用 xxx 模型...
✅ 大语言模型响应成功:
```python
['步骤1', '步骤2']
```
✅ 计划已生成:
```python
['步骤1', '步骤2']
```

--- 正在执行计划 ---

-> 正在执行步骤 1/2: ...
🧠 正在调用 xxx 模型...
✅ 大语言模型响应成功:
...
✅ 步骤 1 已完成，结果: ...

--- 任务完成 ---
最终答案: ...
```

这样做的原因：

- 更符合教学、演示和面试展示场景
- 让“计划生成”和“步骤执行”两个阶段的边界更清楚
- 排查问题时更容易看出到底卡在了哪一步

### 为什么把日志收在 `orchestrator.py`

这次没有把打印逻辑散到 `Planner`、`StepReasoner`、`Resolver` 各自内部，而是集中放在 `PlanResolveAgent.run()` 里。

这样做的原因：

- 业务阶段顺序只有 `orchestrator` 最清楚
- 输出格式可以统一控制
- 底层模块仍然保持“只做事，不负责展示”的职责边界

## `<think>` 输出问题是怎么解决的

之前即使 Prompt 明确禁止 `<think>`，模型仍然可能返回：

```text
<think>...</think>
[
  {...}
]
```

或者在普通回答里直接把 `<think>` 混进正文。

如果只在展示层处理，那么：

- parser 可能已经先被污染
- 某些阶段仍然可能把 `<think>` 原样打印出来

所以这次把清洗逻辑统一收到了 [client.py](/D:/Code/Trae_Project/gwk_ai/interview/Agent/agent/03-plan_resolve/plan_resolve/llm/client.py)。

### 当前清洗策略

`LLMClient.chat()` 现在会在返回文本之前统一做两类清理：

1. 删除完整的 `<think>...</think>`
2. 删除未闭合的 `<think>` 及其后续内容

这样做的原因：

- 上层模块拿到的就是干净文本
- `Planner`、`StepReasoner`、`Resolver` 三条链统一受益
- 不需要每个调用点各自重复写清洗逻辑

### 为什么流式模式也改了

以前流式模式是 token 一到就立即打印，这样即使最后能清洗，`<think>` 也已经先泄露到终端了。

所以现在流式模式的策略改成：

1. 先收集完整响应
2. 清洗 `<think>`
3. 再把清洗后的完整文本交给 `on_token`

这样做的原因：

- 可以彻底避免 `<think>` 在终端先被打印出来
- 更适合当前这种阶段化控制台输出格式

代价是：

- 严格意义上不再是“逐 token 实时打印”
- 更像“保留流式接口，但在展示前统一清洗后输出”

这个取舍是有意的，因为当前项目的目标是稳定展示和清晰排查，而不是追求毫秒级 token 流体验。

### 为什么 `orchestrator.py` 还保留了一层清洗

虽然主清洗已经收口在 `LLMClient`，但 `orchestrator.py` 的 `_clean_inline_text()` 里仍然保留了兜底清洗。

这样做的原因：

- 防止未来某些结果不是从 `LLMClient` 直接返回
- 在控制台展示层再兜一次底，减少脏输出漏网概率

## 一个完整示例

对于问题：

```text
苹果 iPhone 17 手机有哪些亮点？
```

合理的计划应该长这样：

```json
[
  {
    "step_id": 1,
    "content": "搜索苹果 iPhone 17 的主要亮点",
    "executor": "tool",
    "tool_name": "Search",
    "tool_input": "苹果 iPhone 17 主要亮点"
  },
  {
    "step_id": 2,
    "content": "基于搜索结果提炼苹果 iPhone 17 的核心亮点",
    "executor": "llm",
    "tool_name": null,
    "tool_input": null
  },
  {
    "step_id": 3,
    "content": "根据提炼结果生成结构清晰的最终回答",
    "executor": "llm",
    "tool_name": null,
    "tool_input": null
  }
]
```

这里第 2 步和第 3 步虽然不调用工具，但都必须真的执行。

## 为什么这更符合 Plan-and-Resolve

ReAct 的特点是：

- 一边思考，一边决定是否调工具

Plan-and-Resolve 的特点是：

- 先出完整计划
- 再按计划逐步执行

但“逐步执行”并不等于“只执行工具”。

真正的 Plan-and-Resolve 应该支持：

- 工具执行
- LLM 中间思考执行
- 最终答案汇总

这次改造的本质，就是把执行阶段补完整。

## 现在仍然要注意什么

### 1. `stream=True` 更偏向“清洗后展示”而不是真逐 token 输出

这是为了避免 `<think>` 泄露到控制台。

### 2. `StepReasoner` 的中间步骤仍可能影响展示节奏

如果整条链都开流式，那么：

- 规划阶段会输出
- 中间步骤推理也会输出
- 最终汇总也会输出

演示时通常更推荐当前这种非流式阶段化打印方式。

### 3. 这仍然不是通用工作流引擎

当前只支持两种主要执行器：

- `tool`
- `llm`

后面如果要扩展，还可以继续增加：

- `python`
- `db`
- `http`
- `human`

这也是用 `executor` 字段而不是 `use_tool` 的长期价值。

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

## 面试时怎么讲

可以重点讲这几个点：

1. 为什么计划协议不能只用 `use_tool`
2. 为什么执行层必须同时支持工具步骤和 LLM 步骤
3. 为什么 parser 必须对真实模型输出做容错
4. 为什么 `StepReasoner` 要拿到前序结果上下文
5. 为什么 `<think>` 清洗要尽量收口在 `LLMClient`
6. 为什么控制台输出格式适合集中放在 `orchestrator`

一句话总结：

这个项目真正解决的不是“怎么让模型写计划”，而是“怎么把模型计划完整地执行出来，其中工具步骤交给工具，中间思考步骤交给模型，最后再把所有结果汇总成答案，并且在展示层保证输出稳定、可读、可排查”。
