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
        if not stream:
            response = self._client.chat.completions.create(
                model=self.config.model,
                messages=messages,
                temperature=temperature,
            )
            return response.choices[0].message.content or ""

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
