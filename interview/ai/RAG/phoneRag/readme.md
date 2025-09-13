# phoneGPT

- chatbot
    模块化，响应式
    流式输出
    RAG
    supabase
## 项目中运用到的技术
    package.json 依赖配置
    - RAG
        使用embedding openai的embed向量库 将文档转换为向量
        对于用户的提问，也转换为向量
        从supabase中获取所有文档的向量
        使用cosine相似度计算用户提问向量与所有文档向量的相似度
        取出相似度最高的文档
        将文档内容作为上下文，与用户提问一起发送给openai
    - package.json
        ai 的sdk，封装了LLM的调用
        @ai-sdk/openai 封装了openai的调用
        @ai-sdk/react 封装了hook aip 可以用一行完成流式输出
            hooks中封装了chatLLM的功能，方便流式输出
        @ai-sdk/supabase-js 封装了supabase的调用
    - supabase
        BASS 叫做 Backend as  Service
        底层是postgresql 支持向量数据库
    - langchain
        @langchain/community 提供的爬虫工具 基于puppeteer
        @langchain/core 提供了一些核心的类和函数
        LangChain 是一个用于构建基于大语言模型（LLM）的应用程序的开源框架，它通过链接不同的组件（如数据源、工具和提示词）来简化开发流程。
    - dotenv
        用于加载环境变量
    - puppeteer
        用于控制无头浏览器，自动化操作网页
    - lucid-react
        开源图标库，它基于 Lucide 图标集，提供了简洁、一致且可高度定制的矢量图标组件，方便在 React 项目中快速引入和使用。
    - react-markdown
        用于格式化输出，支持渲染markdown文本
    - openai
    - typescript
    - nextjs
    - tailwindcss

npmjs.com 上的相关库

### Next.js
- layout
- use client 表示这个组件是客户端组件

### tailwindcss
    - max-w-3xl mx-auto p-4  实现响应式布局 Mobile First
        - max-w-3xl: 在小屏幕（如手机）上，容器会占满宽度；在大屏幕（如显示器）上，宽度不会超过 768px。
            响应式布局，48rem来适配移动端，ipad竖着的尺寸
        - mx-auto —— 水平居中
        - p-4 —— 设置内边距（padding）
    - max-h-[80vh]  最大高度为80vh  []中可以自定义设置变量

### ts
- 类型定义


### shadcn
    初始化 npx shadcn@latest init
    按需安装 npx shadcn@latest add input
    按需安装 npx shadcn@latest add button



## 项目亮点
1. 前端项目亮点
    - @ai-sdk/react 对chatbot 响应式业务的分装，完成流式输出
    - react-markdown ai响应 markdown是主要格式
    - tailwindcss 响应式布局，动态参数
    - react 组件划分使用shadcn 组件库，按需引入组件，快速搭建前端页面
    - 使用lucide-react图标库
    - 使用ts 类型定义，提高代码质量

2. 后端项目亮点
    - ai streamText 流式输出
        使用result.toDataStreamResponse()
        将streamText 生成的流式结果转换为一个可以被前端消费的Response对象，从而支持流式输出
    - 引入ts-node 个用于直接运行 TypeScript 代码的开发工具包。它的主要作用是允许开发者在 Node.js 环境中直接执行 .ts 和 .tsx 文件，而无需事先通过 tsc （TypeScript 编译器）将其编译为 JavaScript。
    - 爬虫
        - 使用seed脚本
            npm run seed 执行seed脚本，将文档向量化并存储到supabase中,用于填充知识库
        - seed.ts 在中编写脚本
            由于ts文件不能直接运行（需要先解析为js）18版本以上可以直接运行，所以需要使用ts-node 来运行
            使用 # 直接运行（最简单的方式）npx ts-node seed.ts 命令直接执行
    - langchain 是一个Agent开发框架
        里面有coze promptTemplate（动态prompt） 记忆MessageMemory 等
    - 正则html替换
        由于爬取的文档中包含了html标签，所以需要使用正则表达式来替换掉html标签
    
    - supabase
        创建表
        ```sql
            CREATE TABLE public.chunks (
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                content text null,
                vector extensions.vector null,
                url text null,
                date_updated timestamp without time zone DEFAULT now(),
                CONSTRAINT chunks_pkey PRIMARY KEY (id)
            );
        ```
        然后实例化supabase
        ```ts
            import { createClient } from '@supabase/supabase-js'
            const supabase = createClient(
                'https://your-project.supabase.co',
                'your-anon-key'
            )
        ```
        然后就可以使用supabase 来操作数据库了

        - rpc 调用
            用于调用数据库中的函数，
            ```sql
                <!-- 匹配规则 -->
                create or replace function get_relevant_context(
                    <!-- 1536来自于openai的embedding模型的维度 -->
                    embedding vector(1536), 
                    <!-- 相似度阈值 相似度的下线 0.7 表示相似度大于0.7的都可以 -->
                    match_threshold float,
                    <!-- 匹配数量 -->
                    match_count int
                )
                <!-- 函数的返回值 -->
                returns table (
                    id uuid,
                    content text,
                    url text,
                    similarity float
                )
                <!--  -->
                language plpgsql
                as
                $$
                begin
                    return query
                    select
                        id,
                        content,
                        url,
                        <!-- 计算相似度 -->
                        1 - (chunks.vector <=> embedding) as similarity
                    from
                        chunks
                    where
                        <!-- 相似度必须大于阈值  -->
                        <!-- 1减去 -->
                        1 - (chunks.vector <=> embedding) > match_threshold
                    order by
                        <!-- 相似度从大到小排序 -->
                        similarity desc
                    limit
                        match_count;
                end;
                $$;
            ```
    
    - promptTemplate
        设计动态prompt 模板，提升复用性
        他的格式分为
            - 身份
            - 任务
            - 分区
            - 返回格式
            - 约束，不回答约定之外的问题
            - 接收参数，函数返回，应用由几个核心的promptTemplate构成

    - vercel 的AI版图
        - nextjs
        - ai-sdk
        - js 云端运行环境
        - v0 bolt
            用户提问 ——》转为embedding 向量 -》 检索数据库 -》 获取数据并流式输出
            知识库构建 ：网页 wikipidia -》 langchain/community + puppeteer 来获取数据 -》使用langchain 提供的分块机制分块 -》 将数据向量化 -》 存储到supabase中

3. 遇到的问题
    - ai-sdk 检索的时候
        AI生成的是老版本代码，导致调试出现了问题，在这里我使用了mcp来解决这个问题
    - ts-node 编译时不支持esm，
        配置tsconfig.json
        "ts-node": {
            "compilerOptions": {
                "module": "commonjs"
            }
        }
        在编译时会自动将 esm 转换为 commonjs
    - 向量的相似的计算
        - mysql 不支持向量的计算，postgresql 支持
        1 - (chunks.vector <=> embedding) as similarity
        1 减去 向量的点积 就是相似度
    
