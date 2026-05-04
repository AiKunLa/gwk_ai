"""
LLM 配置定义

从环境变量加载配置，支持 OpenAI 兼容 API
"""

from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class LLMConfig:
    """
    LLM 配置

    属性：
    - model: 模型名称
    - api_key: API 密钥
    - base_url: API 端点
    - timeout: 请求超时时间（秒）
    """

    model: str
    api_key: str
    base_url: str
    timeout: int = 60

    @classmethod
    def from_env(cls) -> "LLMConfig":
        """
        从环境变量创建配置

        环境变量：
        - MODEL_ID: 模型名称，默认 gpt-4
        - API_KEY: API 密钥
        - BASE_URL: API 端点
        - TIMEOUT: 超时时间，默认 60
        """
        return cls(
            model=os.getenv("MODEL_ID", "gpt-4"),
            api_key=os.getenv("API_KEY", ""),
            base_url=os.getenv("BASE_URL", "https://api.openai.com/v1"),
            timeout=int(os.getenv("TIMEOUT", "60")),
        )