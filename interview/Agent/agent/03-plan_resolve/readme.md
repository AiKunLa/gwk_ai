## 目录结构
```angular2html
03-plan_resolve/
├─ run.py
├─ .env
├─ README.md
│
├─ plan_resolve/
│  ├─ __init__.py
│  │
│  ├─ agent/
│  │  ├─ __init__.py
│  │  ├─ planner.py          # 任务拆解 / 生成计划
│  │  ├─ resolver.py         # 执行计划 / 汇总结果
│  │  └─ parser.py           # 解析模型输出
│  │
│  ├─ llm/
│  │  ├─ __init__.py
│  │  ├─ client.py           # LLMClient，统一模型调用入口
│  │  └─ config.py           # model/base_url/api_key/timeout 配置读取
│  │
│  ├─ prompts/
│  │  ├─ __init__.py
│  │  ├─ planner.py          # PLANNER_PROMPT_TEMPLATE
│  │  ├─ resolver.py         # RESOLVER_PROMPT_TEMPLATE
│  │  └─ renderer.py         # format_prompt / 渲染模板
│  │
│  ├─ tools/
│  │  ├─ __init__.py
│  │  ├─ base.py             # Tool 定义，例如 name/description/func
│  │  ├─ registry.py         # 工具注册表
│  │  ├─ executor.py         # 根据工具名执行工具
│  │  └─ builtin/
│  │     ├─ __init__.py
│  │     └─ search.py
│  │
│  └─ schemas/
│     ├─ __init__.py
│     ├─ plan.py             # PlanStep / PlanResult
│     └─ tool.py             # ToolCall / ToolResult
│
└─ tests/
   ├─ test_planner.py
   └─ test_tools.py

```
