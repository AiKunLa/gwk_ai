from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from State import SearchState

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from tavily import TavilyClient
import json
# 加载 .env 文件中的环境变量
load_dotenv()

# 初始化模型
# 我们将使用这个 llm 实例来驱动所有节点的智能
llm = ChatOpenAI(
    model=os.getenv("LLM_MODEL_ID", "gpt-4o-mini"),
    api_key=os.getenv("LLM_API_KEY"),
    base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
    temperature=0.7
)
# 初始化Tavily客户端
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))




"""
理解用户意图节点
"""


def understand_query_node(state: SearchState) -> dict:
    user_message = state["messages"][-1].content

    prompt = f"""分析用户的查询："{user_message}"
请以严格的JSON格式返回，包含两个字段：summary（中文总结）和 search_keywords（中英文搜索关键词，用空格分隔）。
不要包含任何其他文字。示例：
{{"summary": "用户想了解明天北京天气和旅游景点", "search_keywords": "北京明天天气 北京景点推荐"}}"""

    response = llm.invoke([HumanMessage(content=prompt)])
    response_text = response.content.strip()

    try:
        # 尝试直接解析 JSON
        parsed = json.loads(response_text)
    except json.JSONDecodeError:
        # 如果失败，尝试提取第一个 JSON 对象
        import re
        match = re.search(r'\{.*?\}', response_text, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
        else:
            parsed = {"summary": user_message, "search_keywords": user_message}

    search_query = parsed.get("search_keywords", user_message)
    summary = parsed.get("summary", user_message)

    return {
        "user_query": summary,
        "search_query": search_query,
        "step": "understood",
        "messages": [AIMessage(content=f"我将为您搜索：{search_query}")]
    }
def tavily_search_node(state: SearchState) -> dict:
    """步骤2：使用Tavily API进行真实搜索"""
    search_query = state["search_query"]
    try:
        print(f"🔍 正在搜索: {search_query}")
        response = tavily_client.search(
            query=search_query,
            search_depth="basic",
            max_results=5,
            include_answer=True
        )

        # 1. 提取 Tavily 生成的综合答案（如果有）
        tavily_answer = response.get("answer", "")

        # 2. 格式化多个搜索结果
        formatted_results = []
        for idx, result in enumerate(response.get("results", []), 1):
            formatted_results.append(
                f"--- 结果 {idx} ---\n"
                f"标题: {result.get('title', '无标题')}\n"
                f"内容: {result.get('content', '无内容')}\n"
                f"链接: {result.get('url', '')}"
            )

        # 3. 组合成易于阅读的文本
        search_results = f"【综合答案】\n{tavily_answer}\n\n" if tavily_answer else ""
        search_results += "\n".join(formatted_results)

        return {
            "search_results": search_results,
            "step": "searched",
            "messages": [AIMessage(content="✅ 搜索完成！正在整理答案...")]
        }
    except Exception as e:
        # 搜索失败时的回退处理
        return {
            "search_results": f"搜索失败：{e}",
            "step": "search_failed",
            "messages": [AIMessage(content="❌ 搜索遇到问题，将基于已有知识回答...")]
        }


def generate_answer_node(state: SearchState) -> dict:
    """步骤3：基于搜索结果生成最终答案"""
    if state["step"] == "search_failed":
        # 如果搜索失败，完全依赖 LLM 自身知识
        fallback_prompt = f"请你用中文回答以下用户问题：\n{state.get('user_query', state['messages'][-1].content)}"
        response = llm.invoke([HumanMessage(content=fallback_prompt)])
    else:
        # 搜索成功，基于结果回答
        search_results = state.get("search_results", "无搜索结果")
        # 防止 search_results 为空或 Ellipsis
        if not isinstance(search_results, str) or not search_results.strip():
            search_results = "暂无详细搜索结果"

        answer_prompt = f"""基于以下搜索结果为用户提供清晰、准确的回答（用中文）：
        用户问题：{state.get('user_query', '')}
        搜索结果：
        {search_results}
        
        注意事项：
        - 如果搜索结果不完整，可以结合你的知识补充。
        - 回答应结构化，便于用户阅读。"""
        response = llm.invoke([HumanMessage(content=answer_prompt)])
    final_text = response.content
    # 移除  中的 <think> 块
    if '<think>' in final_text:
        final_text = final_text.split('</think>')[-1].strip()

    return {
        "final_answer": final_text,
        "step": "completed",
        "messages": [AIMessage(content=final_text)]
    }