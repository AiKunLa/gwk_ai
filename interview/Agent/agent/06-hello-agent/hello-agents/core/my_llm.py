# my_llm.py
import os
from typing import Optional
from openai import OpenAI
from hello_agents import HelloAgentsLLM

class MyLLM(HelloAgentsLLM):
    """
    一个自定义的LLM客户端，通过继承增加了对ModelScope的支持。
    """
    def __init__(
            self,
            model:Optional[str] = None,
            api_key:Optional[str] = None,
            base_url:Optional[str] = None,
            provider:Optional[str] = "auto",
            **kwargs
    ):
