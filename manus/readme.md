# Manus
- 我们目前处于AIGC的时代，如LLM deepseek等，主要主要是代码生成、方案生成、建议等
- Manus——下一代AI总管产品
 - 假设你是一个hr，面对一堆的简历，你该如何使用AI来筛选，请设计一个程序来自动筛选
  - 首先将简历放入一个文件夹中
  - 使用AI 工具读取读取文件夹中的所有文件（操作电脑）
  - AI 通过prompt中的要求，为每一个简历打分，筛选出符合要求的简历
  - 把这符合要求的简历对应的名字、电话、得分 计入到excel表格中（按得分排序）。
  - 给前10%的简历发送邮件，告知他们通过了筛选-

- The General AI Agent(智能体集合) 当你给她任务时，他会给你分配一个AI助手（专门该干对应活的大模型） 所以Manus被称为AI总管
  - 派一个AI助手给我们，直接帮我们干活 （操作电脑，分析简历，写入excel，发邮件等一系列工作流程）他将这些工作串联在一起
  - 当你给它一个任务时，他会自动列出一个工作流程（todolist），然后一步一步的执行
  - 他给你分配一个云服务器，AI助手可以直接操作电脑，分析文件，写入excel，发邮件等一系列工作流程
eg: 
 - 分析过去三年NVDA，MRVL和TSM股票价格直接的相关性
  - 列出一个todolist
  - 1. 招募一个agent url 爬取NVDA，MRVL和TSM股票价格
  - 2. 进行数学建模分析三家股票的相关性，绘制相关性图
  - 3. 可视化
  - 4. 给出相关
  - 上面每一步都可以派一个agent来完成
- AI自动化

# openai AIGC接口
 - 调用openai llm接口
 - 命令行调用
  - npm init -y 初始化为node后端项目   
   - npm是什么 node package manager 包管理工具
  - package.json 项目配置文件，里面有依赖的包
 - openai 提供了sdk 可以直接调用

 - 安装openai sdk
  - npm install openai 安装openai sdk   （将openai这个sdk下载到本地文件夹node_modules）该文件夹中包含了opennai这个依赖模块以及依赖模块的依赖模块
  - 安装完成后，会在node_modules文件夹中生成openai文件夹，里面有openai.js文件，这个文件就是openai sdk

 - index.mjs - 入口文件 模块化的js
