# example.py 模块化拆分方案

## 目录结构

```
01-agent_demo/
├── prompts.py              # 系统提示词
├── tools/
│   ├── __init__.py
│   ├── weather.py          # 天气工具
│   ├── attraction.py       # 景点工具
│   └── registry.py         # 工具注册表
├── llm/
│   ├── __init__.py
│   └── client.py           # LLM 客户端
├── run.py                  # 主入口（原 example.py）
└── .env                    # 环境变量
```

## 各文件职责

| 文件 | 职责 |
|------|------|
| `prompts.py` | 集中管理 AGENT_SYSTEM_PROMPT 等常量 |
| `tools/weather.py` | wttr.in 天气 API 调用 |
| `tools/attraction.py` | Tavily 景点搜索 API 调用 |
| `tools/registry.py` | available_tools 注册表 |
| `llm/client.py` | OpenAICompatibleClient 类 |
| `run.py` | 主入口：配置初始化 + ReAct 循环 |

---

## 详细执行方案

### Step 1: 创建 tools/ 目录结构

**创建 `tools/__init__.py`**
```python
from .weather import get_weather
from .attraction import get_attraction
from .registry import available_tools

__all__ = ["get_weather", "get_attraction", "available_tools"]
```

**创建 `tools/weather.py`**
```python
import requests

def get_weather(city: str) -> str:
    """通过 wttr.in API 查询真实天气"""
    url = f"https://wttr.in/{city}?format=j1"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        current = data['current_condition'][0]
        weather_desc = current['weatherDesc'][0]['value']
        temp_c = current['temp_C']
        return f"{city}当前天气：{weather_desc}，气温{temp_c}摄氏度"
    except requests.exceptions.RequestException as e:
        return f"错误：查询天气时遇到网络问题 - {e}"
    except (KeyError, IndexError) as e:
        return f"错误：解析天气数据失败，可能是城市名称无效 - {e}"
```

**创建 `tools/attraction.py`**
```python
import os
from tavily import TavilyClient

def get_attraction(city: str, weather: str) -> str:
    """使用 Tavily API 搜索景点推荐"""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return "错误：未配置 TAVILY_API_KEY。"

    tavily = TavilyClient(api_key=api_key)
    query = f"'{city}' 在'{weather}'天气下最值得去的旅游景点推荐及理由"

    try:
        response = tavily.search(query=query, search_depth="basic", include_answer=True)
        if response.get("answer"):
            return response["answer"]

        formatted_results = []
        for result in response.get("results", []):
            formatted_results.append(f"- {result['title']}: {result['content']}")

        if not formatted_results:
            return "抱歉，没有找到相关的旅游景点推荐。"
        return "根据搜索，为您找到以下信息：\n" + "\n".join(formatted_results)
    except Exception as e:
        return f"错误：执行 Tavily 搜索时出现问题 - {e}"
```

**创建 `tools/registry.py`**
```python
from .weather import get_weather
from .attraction import get_attraction

available_tools = {
    "get_weather": get_weather,
    "get_attraction": get_attraction,
}
```

### Step 2: 创建 llm/ 目录结构

**创建 `llm/__init__.py`**
```python
from .client import OpenAICompatibleClient

__all__ = ["OpenAICompatibleClient"]
```

**创建 `llm/client.py`**
```python
from openai import OpenAI

class OpenAICompatibleClient:
    """调用任何 OpenAI 兼容接口的 LLM 服务"""

    def __init__(self, model: str, api_key: str, base_url: str):
        self.model = model
        self.client = OpenAI(api_key=api_key, base_url=base_url)

    def generate(self, prompt: str, system_prompt: str) -> str:
        """调用 LLM API 生成回应"""
        print("正在调用大语言模型...")
        try:
            messages = [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt}
            ]
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=False
            )
            answer = response.choices[0].message.content
            print("大语言模型响应成功。")
            return answer
        except Exception as e:
            print(f"调用LLM API时发生错误: {e}")
            return "错误：调用语言模型服务时出错。"
```

### Step 3: 创建 prompts.py

**创建 `prompts.py`**
```python
AGENT_SYSTEM_PROMPT = """
你是一个智能旅行助手。你的任务是分析用户的请求，并使用可用工具一步步地解决问题。

# 可用工具:
- `get_weather(city: str)`: 查询指定城市的实时天气。
- `get_attraction(city: str, weather: str)`: 根据城市和天气搜索推荐的旅游景点。

# 输出格式要求:
你的每次回复必须严格遵循以下格式，包含一对Thought和Action：

Thought: [你的思考过程和下一步计划]
Action: [你要执行的具体行动]

Action的格式必须是以下之一：
1. 调用工具：function_name(arg_name="arg_value")
2. 结束任务：Finish[最终答案]

# 重要提示:
- 每次只输出一对Thought-Action
- Action必须在同一行，不要换行
- 当收集到足够信息可以回答用户问题时，必须使用 Action: Finish[最终答案] 格式结束

请开始吧！
"""
```

### Step 4: 创建 run.py（重写原 example.py）

```python
import os
import re
from dotenv import load_dotenv

from prompts import AGENT_SYSTEM_PROMPT
from tools.registry import available_tools
from llm.client import OpenAICompatibleClient

# 加载环境变量
load_dotenv()

# 初始化 LLM 客户端
llm = OpenAICompatibleClient(
    model=os.getenv("MODEL_ID"),
    api_key=os.getenv("API_KEY"),
    base_url=os.getenv("BASE_URL")
)

# 设置 Tavily API Key
os.environ['TAVILY_API_KEY'] = os.getenv("TAVILY_API_KEY")


def run_agent(user_prompt: str, max_turns: int = 5):
    """运行 Agent 主循环"""
    prompt_history = [f"用户请求: {user_prompt}"]

    for i in range(max_turns):
        print(f"--- 循环 {i+1} ---\n")

        full_prompt = "\n".join(prompt_history)
        llm_output = llm.generate(full_prompt, system_prompt=AGENT_SYSTEM_PROMPT)

        # 截断多余的 Thought-Action 对
        match = re.search(
            r'(Thought:.*?Action:.*?)(?=\n\s*(?:Thought:|Action:|Observation:)|\Z)',
            llm_output,
            re.DOTALL
        )
        if match:
            truncated = match.group(1).strip()
            if truncated != llm_output.strip():
                llm_output = truncated
                print("已截断多余的 Thought-Action 对")

        print(f"模型输出:\n{llm_output}\n")
        prompt_history.append(llm_output)

        # 解析 Action
        action_match = re.search(r"Action: (.*)", llm_output, re.DOTALL)
        if not action_match:
            observation = "错误: 未能解析到 Action 字段。"
            prompt_history.append(f"Observation: {observation}")
            print(f"Observation: {observation}\n")
            continue

        action_str = action_match.group(1).strip()

        if action_str.startswith("Finish"):
            final_answer = re.match(r"Finish\[(.*)\]", action_str).group(1)
            print(f"任务完成，最终答案: {final_answer}")
            return final_answer

        # 解析并执行工具
        tool_name = re.search(r"(\w+)\(", action_str).group(1)
        args_str = re.search(r"\((.*)\)", action_str).group(1)
        kwargs = dict(re.findall(r'(\w+)="([^"]*)"', args_str))

        if tool_name in available_tools:
            observation = available_tools[tool_name](**kwargs)
        else:
            observation = f"错误：未定义的工具 '{tool_name}'"

        observation_str = f"Observation: {observation}"
        print(f"{observation_str}\n")
        prompt_history.append(observation_str)

    return "已达到最大循环次数"


if __name__ == "__main__":
    user_prompt = "你好，请帮我查询一下今天西安的天气，然后根据天气推荐一个合适的旅游景点。"
    print(f"用户输入: {user_prompt}\n" + "=" * 40)
    run_agent(user_prompt)
```

---

## 依赖关系图

```
prompts.py ──┐
             │
tools/ ──────┼──► registry.py ──► run.py
             │         ▲
weather.py   │         │
attraction.py ─────────┘
             │
llm/client.py ──► run.py
```

---

## 验证步骤

1. **安装依赖**:
   ```bash
   pip install python-dotenv openai tavily requests
   ```

2. **确认 .env 文件存在且配置正确**

3. **运行测试**:
   ```bash
   python run.py
   ```

4. **预期输出**: Agent 应能查询天气并推荐景点

---

## 改动清单

| 操作 | 文件 |
|------|------|
| 新建 | `tools/__init__.py` |
| 新建 | `tools/weather.py` |
| 新建 | `tools/attraction.py` |
| 新建 | `tools/registry.py` |
| 新建 | `llm/__init__.py` |
| 新建 | `llm/client.py` |
| 新建 | `prompts.py` |
| 新建 | `run.py` |
| 删除 | `example.py`（移入 run.py） |
| 保留 | `.env` |
| 可选删除 | `testEnv.py`（已过时） |
