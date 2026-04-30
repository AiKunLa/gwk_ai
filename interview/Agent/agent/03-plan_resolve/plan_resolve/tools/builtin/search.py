"""
内置搜索工具 - 使用 SerpAPI 执行 Google 搜索

功能：
- 从环境变量 SERPAPI_API_KEY 获取 API 密钥
- 支持中文搜索（gl=cn, hl=zh-cn）
- 优先返回答案框内容，其次知识图谱，最后有机结果摘要
"""

import os

from dotenv import load_dotenv
from serpapi import SerpApiClient

from ..base import ToolSpec

load_dotenv()


def search_impl(query: str) -> str:
    """
    执行 Google 搜索并返回结构化结果

    优先级：答案框 > 知识图谱描述 > 有机结果摘要（前3条）
    """
    api_key = os.getenv("SERPAPI_API_KEY")
    if not api_key:
        return "Error: SERPAPI_API_KEY is not configured."

    try:
        client = SerpApiClient(
            {
                "engine": "google",
                "q": query,
                "api_key": api_key,
                "gl": "cn",
                "hl": "zh-cn",
            }
        )
        results = client.get_dict()

        if "answer_box" in results and "answer" in results["answer_box"]:
            return results["answer_box"]["answer"]

        if "knowledge_graph" in results and "description" in results["knowledge_graph"]:
            return results["knowledge_graph"]["description"]

        if "organic_results" in results and results["organic_results"]:
            snippets = [
                f"[{index + 1}] {item.get('title', '')}: {item.get('snippet', '')}"
                for index, item in enumerate(results["organic_results"][:3])
            ]
            return "\n".join(snippets)

        return f"No result found for '{query}'."
    except Exception as exc:
        return f"Search error: {exc}"


# 工具规格定义 - 注册到 ToolRegistry 时使用
search_tool = ToolSpec(
    name="Search",
    description=(
        "Web search tool for retrieving up-to-date facts, product information, "
        "news, and other external information unavailable in the model context."
    ),
    func=search_impl,
)
