import os
import re
from dotenv import load_dotenv

from prompts import AGENT_SYSTEM_PROMPT
from tools.registry import available_tools
from llm.client import OpenAICompatibleClient

# 加载环境变量
load_dotenv()

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