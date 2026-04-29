import os
# 加载 .env 文件（必须！）
from serpapi import SerpApiClient

from dotenv import load_dotenv
load_dotenv()
def search(query:str) -> str :
    """
     一个基于SerpApi的实战网页搜索引擎工具。
     它会智能地解析搜索结果，优先返回直接答案或知识图谱信息。
    """
    try:
        api_key = os.getenv('SERPAPI_API_KEY')
        if not api_key:
            return "错误:SERPAPI_API_KEY 未在 .env 文件中配置"

        params = {
            "engine": "google",
            "q": query,
            "api_key": api_key,
            "gl": "cn",  # 国家代码
            "hl": "zh-cn",  # 语言代码
        }

        client = SerpApiClient(params)
        results = client.get_dict()

        # 首先会检查是否存在answer_box（Google的答案摘要框）或knowledge_graph（知识图谱）等信息，
        # 如果存在，就直接返回这些最准确的答案。
        # 如果不存在，就会上述退而求其次，返回前三个常规搜索结果的摘要。
        # 这种“智能解析”使LLM提供质量的信息输入。

        # 智能解析:优先寻找最直接的答案
        if "answer_box_list" in results:
            return "\n".join(results["answer_box_list"])
        if "answer_box" in results and "answer" in results["answer_box"]:
            return results["answer_box"]["answer"]

        if "knowledge_graph" in results and "description" in results["knowledge_graph"]:
            return results["knowledge_graph"]["description"]
        if "organic_results" in results and results["organic_results"]:
            # 如果没有直接答案，则返回前三个有机结果的摘要
            snippets = [
                f"[{i + 1}] {res.get('title', '')}\n{res.get('snippet', '')}"
                for i, res in enumerate(results["organic_results"][:3])
            ]
            return "\n\n".join(snippets)

        return f"对不起，没有找到关于 '{query}' 的信息。"
    except Exception as e:
        return f"搜索时发生错误: {e}"