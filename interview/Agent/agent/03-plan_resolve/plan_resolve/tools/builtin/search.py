import os
from serpapi import SerpApiClient
from dotenv import load_dotenv
from ..base import ToolSpec

load_dotenv()

def search_impl(query: str) -> str:
    api_key = os.getenv("SERPAPI_API_KEY")
    if not api_key:
        return "错误: SERPAPI_API_KEY 未配置"

    try:
        client = SerpApiClient({
            "engine": "google",
            "q": query,
            "api_key": api_key,
            "gl": "cn",
            "hl": "zh-cn",
        })
        results = client.get_dict()

        if "answer_box" in results and "answer" in results["answer_box"]:
            return results["answer_box"]["answer"]

        if "knowledge_graph" in results and "description" in results["knowledge_graph"]:
            return results["knowledge_graph"]["description"]

        if "organic_results" in results and results["organic_results"]:
            snippets = [
                f"[{i+1}] {res.get('title', '')}: {res.get('snippet', '')}"
                for i, res in enumerate(results["organic_results"][:3])
            ]
            return "\n".join(snippets)

        return f"未找到关于 '{query}' 的结果"
    except Exception as e:
        return f"搜索错误: {e}"

# 定义工具规范
search_tool = ToolSpec(
    name="Search",
    description=(
        "网页搜索引擎，当需要获取实时信息、最新新闻、产品价格、"
        "事件进展或在知识库中找不到的事实性信息时使用。"
        "输入一个搜索查询字符串，返回搜索结果摘要。"
        ),
    func=search_impl,
)
