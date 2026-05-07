import sys
from pathlib import Path

# 将 Reflection 目录添加到路径
reflection_path = Path(__file__).parent / "Reflection"
sys.path.insert(0, str(reflection_path))

from Reflection.llm import HelloAgentsLLM
from Reflection.agent import ReflectionAgent

if __name__ == '__main__':
    llm_client = HelloAgentsLLM()
    fun_desc = "编写一个Python函数，找出1到n之间所有的素数 "

    lm = ReflectionAgent(llm_client)
    response = lm.run(fun_desc)
    print(response)
