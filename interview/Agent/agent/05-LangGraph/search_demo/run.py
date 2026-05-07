from graph import create_search_assistant
from langchain_core.messages import HumanMessage

if __name__ == '__main__':
    app = create_search_assistant()

    # 运行图
    # inputs = {"current_task": "分析最近的AI行业新闻", "messages": []}
    # 2. 必须把用户问题放进 messages 列表，不能只放 current_task
    inputs = {
        "messages": [HumanMessage(content="明天我要去北京，天气怎么样？有合适的景点吗")]
    }
    for event in app.stream(inputs):
        print(event)