# rag-loader

`rag-loader` 是 LangChain 生态中的文档加载器模块，负责将各种格式的原始文档（网页、Markdown、CSV、PDF 等）转换为 LangChain 的标准 `Document` 对象，以便后续进行向量化处理。

## 核心概念

```
原始文档 → rag-loader → Document 对象 → 向量化 → RAG 问答
```

`Document` 对象包含：
- `pageContent`：文档的文本内容
- `metadata`：元数据（来源、作者、创建时间等）

## 支持的文件类型

### Web 网页

```javascript
import { WebBaseLoader } from "@langchain/community/document_loaders/web/web";
import { WebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const loader = new WebBaseLoader("https://example.com/article");
const docs = await loader.load();
```

### Markdown

```javascript
import { MarkdownLoader } from "@langchain/community/document_loaders/fs/markdown";

const loader = new MarkdownLoader("./docs/guide.md");
const docs = await loader.load();
```

### CSV

```javascript
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader("./data/users.csv");
const docs = await loader.load();
```

### PDF

```javascript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("./documents/report.pdf");
const docs = await loader.load();
```

### TXT 文本

```javascript
import { TextLoader } from "@langchain/community/document_loaders/fs/text";

const loader = new TextLoader("./logs/app.log");
const docs = await loader.load();
```

### Notion

```javascript
import { NotionLoader } from "@langchain/community/document_loaders/web/notion";

const loader = new NotionLoader("notion-page-id");
const docs = await loader.load();
```

## 通用加载模式

```javascript
// 批量加载多个文件
const loaders = [
  new TextLoader("./doc1.txt"),
  new CSVLoader("./data.csv"),
  new MarkdownLoader("./readme.md"),
];

const documents = [];
for (const loader of loaders) {
  const docs = await loader.load();
  documents.push(...docs);
}
```

## 元数据处理

```javascript
// 加载时可指定额外元数据
const loader = new TextLoader("./article.txt");
const docs = await loader.load();

// 为所有文档添加统一元数据
docs.forEach(doc => {
  doc.metadata.source = "user-manual";
  doc.metadata.category = "tutorial";
});
```

## 常见使用场景

| 场景 | 加载器 | 说明 |
|------|--------|------|
| 爬取网页内容 | `WebBaseLoader` | 支持 Cheerio 解析 |
| 加载本地文档 | `PDFLoader`, `MarkdownLoader` | 支持多种格式 |
| 加载结构化数据 | `CSVLoader` | 按行或按列分割 |
| 企业文档库 | `NotionLoader`, `ConfluenceLoader` | 集成第三方平台 |
