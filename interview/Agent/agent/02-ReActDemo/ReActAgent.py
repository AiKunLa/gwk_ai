
from tools.ToolExecutor import ToolExecutor 
from prompt import REACT_PROMPT_TEMPLATE
from HelloAgentsLLM import HelloAgentsLLM
import re

class ReActAgent:
    def __init__(self,llm_client:HelloAgentsLLM,tool_executor:ToolExecutor,max_steps:int=5):
        self.llm_client = llm_client
        self.tool_executor = tool_executor
        self.max_steps =max_steps
        self.history = []

    def run(self,question:str):
        self.history = []
        current_step = 0

        while current_step < self.max_steps:
            current_step+=1
            print(f"--- 第 {current_step} 步 ---")

            # 获取注册工具描述
            tools_desc = self.tool_executor.getAvailableTools()
            history_str = "\n".join(self.history)

            # 提示词拼接 tools + 历史 + 问题
            prompt = REACT_PROMPT_TEMPLATE.format(
                tools=tools_desc,
                question=question,
                history=history_str
            )

            message = [{'role':'user','content':prompt}]
            response_text = self.llm_client.think(message)

            if not response_text:
                print("错误:LLM未能返回有效响应。")
                break

            # 放入历史记录里面去
            thought,action = self._parse_output(response_text)
            if thought:
                print(f"思考: {thought}")
            if not action:
                print("警告:未能解析出有效的Action，流程终止。")
                break

            if action.startswith('Finish'):
                # 去掉可能的 "Action: " 前缀
                action_clean = action[len('Action: '):] if action.startswith('Action: ') else action
                match = re.match(r"Finish\[(.*)\]", action_clean)
                if match:
                    final_answer = match.group(1)
                    print(f"🎉 最终答案: {final_answer}")
                    return final_answer

            tool_name, tool_input = self._parse_action(action)
            if not tool_name or not tool_input:
                # ... 处理无效Action格式 ...
                continue
            print(f"🎬 行动: {tool_name}[{tool_input}]")

            tool_function = self.tool_executor.getTool(tool_name)
            if not tool_function:
                observation = f"错误:未找到名为 '{tool_name}' 的工具。"
            else:
                observation = tool_function(tool_input)
            print(f"👀 观察: {observation}")

            # 将本轮的Action和Observation添加到历史记录中
            self.history.append(f"Action: {action}")
            self.history.append(f"Observation: {observation}")
        # 循环结束
        print("已达到最大步数，流程终止。")
        return None



# (这些方法是 ReActAgent 类的一部分)
    # 负责从LLM的完整响应中分离出Thought两个Action主要部分。
    def _parse_output(self, text: str):
        """解析LLM的输出，提取Thought和Action。
        """
        # Thought: 匹配到 Action: 或文本末尾
        thought_match = re.search(r"Thought:\s*(.*?)(?=\nAction:|$)", text, re.DOTALL)
        # Action: 匹配到文本末尾
        action_match = re.search(r"Action:\s*(.*?)$", text, re.DOTALL)
        thought = thought_match.group(1).strip() if thought_match else None
        action = action_match.group(1).strip() if action_match else None
        return thought, action
    # 负责进一步解析Action字符串，Search[华为最新手机]例如提取出工具名Search和工具输入华为最新手机。
    def _parse_action(self, action_text: str):
        """解析Action字符串，提取工具名称和输入。
        """
        match = re.match(r"(\w+)\[(.*)\]", action_text, re.DOTALL)
        if match:
            return match.group(1), match.group(2)
        return None, None