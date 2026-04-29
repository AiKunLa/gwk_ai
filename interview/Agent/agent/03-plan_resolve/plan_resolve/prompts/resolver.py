RESOLVER_PROMPT_TEMPLATE = """你是一个答案整合助手。

用户问题：{question}

已完成的步骤及结果：
{steps_text}

请根据以上信息，生成一个完整、连贯的最终答案。
答案应该：
1. 直接回答用户的问题
2. 整合各步骤的结果
3. 语言流畅、结构清晰

最终答案："""

def render_resolver_prompt(question: str, steps_text: str) -> str:
    return RESOLVER_PROMPT_TEMPLATE.format(question=question, steps_text=steps_text)
