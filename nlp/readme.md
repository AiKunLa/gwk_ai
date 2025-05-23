# 机器学习

- notebootllm
  你不知道的 JavaScript 深入学习
  AI 博客

- modelscope
- python notebook
  ipynb 后缀
  nlp 机器学习
  机器学习情感分析 nlp demo
- python notebook
  ipynb 后缀

- 引入 pipelines 管道
  model 中国第一大模型语言
  魔塔
  form modelscope.pipelines import pipeline
  from modelscope.utils.constant import Tasks
  情感分析类
  pipeline 派出任务 第一个参数是 Tasks.text_classification 表示对是文本分类任务 第二个参数是模型的名称 来自
  semantic_cls 是一个实例
  semantic_cls = pipeline(Tasks.text_classification,'damo/nlp_structbert_sentiment-classification_chinese-base')

result = semantic_cls('回答我，Look my eyes！Tall me Why！')

# 机器学习情感分析 nlp demo

# modelscope 命名空间

# 机器学习有很多任务，pipe 管道 引入

from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks

# 情感分析类

# 派出任务

semantic_cls = pipeline(Tasks.text_classification,'damo/nlp_structbert_sentiment-classification_chinese-base')