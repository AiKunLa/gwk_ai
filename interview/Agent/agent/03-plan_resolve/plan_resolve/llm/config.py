from dataclasses import dataclass
import os
from dotenv import load_dotenv
load_dotenv()

@dataclass
class LLMConfig:
    model:str
    api_key:str
    base_url:str
    timeout:int =60

    @classmethod
    def from_env(cls) -> "LLMConfig":
        return cls(
            model=os.getenv("MODEL_ID", "gpt-4"),
            api_key=os.getenv("API_KEY", ""),
            base_url=os.getenv("BASE_URL", "https://api.openai.com/v1"),
            timeout=int(os.getenv("TIMEOUT", "60")),
        )