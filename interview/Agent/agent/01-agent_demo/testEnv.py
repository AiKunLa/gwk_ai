import os
from dotenv import load_dotenv

# 加载 .env 文件（必须！）
load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
MODEL_ID = os.getenv("MODEL_ID")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

print(f"API_KEY: {API_KEY}")
print(f"BASE_URL: {BASE_URL}")
print(f"MODEL_ID: {MODEL_ID}")
print(f"TAVILY_API_KEY: {TAVILY_API_KEY}")
