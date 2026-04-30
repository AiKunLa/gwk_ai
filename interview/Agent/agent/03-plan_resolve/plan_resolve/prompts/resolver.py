# Resolver Prompt - 指导 LLM 整合执行结果生成最终答案
#
# 设计要点：
# 1. 简洁指令，强调"整合"而非"重新推理"
# 2. 原始步骤结果已经包含执行输出，无需 LLM 再次搜索
# 3. 要求语言流畅、结构清晰
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
    """渲染 Resolver Prompt"""
    return RESOLVER_PROMPT_TEMPLATE.format(question=question, steps_text=steps_text)
