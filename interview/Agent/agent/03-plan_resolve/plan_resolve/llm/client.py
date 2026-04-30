"""
LLM 客户端 - 封装与 OpenAI 兼容 API 的交互

职责：
- 统一管理 API 配置（model, api_key, base_url）
- 提供同步/流式两种调用方式
- 流式输出支持 on_token 回调用于实时展示
"""

from typing import Callable

from openai import OpenAI

from .config import LLMConfig


class LLMClient:
    def __init__(self, config: LLMConfig):
        if not all([config.model, config.api_key, config.base_url]):
            raise ValueError("model, api_key, and base_url are required")

        self.config = config
        self._client = OpenAI(
            api_key=config.api_key,
            base_url=config.base_url,
            timeout=config.timeout,
        )

    def chat(
        self,
        messages: list[dict],
        temperature: float = 0,
        stream: bool = False,
        on_token: Callable[[str], None] | None = None,
    ) -> str:
        """
        发送聊天请求到 LLM

        参数：
        - messages: 消息列表，每条为 {"role": str, "content": str}
        - temperature: 采样温度，默认 0（更确定性）
        - stream: 是否启用流式输出
        - on_token: 流式输出回调，每收到一个 token 就调用一次

        返回：完整的 assistant 回复文本
        """
        if not stream:
            # 非流式：等待完整响应
            response = self._client.chat.completions.create(
                model=self.config.model,
                messages=messages,
                temperature=temperature,
            )
            return response.choices[0].message.content or ""

        # 流式：逐块返回，通过回调实时输出
        response = self._client.chat.completions.create(
            model=self.config.model,
            messages=messages,
            temperature=temperature,
            stream=True,
        )

        chunks: list[str] = []
        for chunk in response:
            delta = chunk.choices[0].delta
            content = delta.content or ""
            if not content:
                continue

            chunks.append(content)
            if on_token is not None:
                on_token(content)

        return "".join(chunks)

    def think(self, messages: list[dict], temperature: float = 0) -> str:
        text = self.chat(
            messages=messages,
            temperature=temperature,
            stream=True,
            on_token=lambda token: print(token, end="", flush=True),
        )
        print()
        return text
