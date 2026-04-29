from openai import OpenAI
from .config import LLMConfig
from typing import List, Dict
class LLMClient:
    def __init__(self, config: LLMConfig):
        if not all([config.model,config.api_key,config.base_url]):
            raise ValueError("模型ID、API密钥和服务地址必须被提供或在.env文件中定义。")

        self.config = config
        self._client = OpenAI(api_key=config.api_key, base_url=config.base_url)

    def chat(self, messages: list[dict], temperature: float = 0) -> str:
        response = self._client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content

    def think(self, messages: List[Dict[str, str]], temperature: float = 0) -> str:
        """
        调用大语言模型进行思考，并返回其响应。
        """
        print(f"🧠 正在调用 {self.model} 模型...")
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                stream=True,
            )

            # 处理流式响应
            print("✅ 大语言模型响应成功:")
            collected_content = []
            for chunk in response:
                content = chunk.choices[0].delta.content or ""
                print(content, end="", flush=True)
                collected_content.append(content)
            print()  # 在流式输出结束后换行
            return "".join(collected_content)

        except Exception as e:
            print(f"❌ 调用LLM API时发生错误: {e}")
            return None
