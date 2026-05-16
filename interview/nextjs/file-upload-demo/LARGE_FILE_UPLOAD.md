# 大文件分片上传与断点续传 — 业务逻辑详解

## 一、整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      浏览器 (前端)                        │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │ 文件选择  │──▶│ 切片+哈希 │──▶│ 并发上传分片(×3) │    │
│  └──────────┘   └──────────┘   └──────────────────┘    │
│                        │              │                  │
│                        ▼              ▼                  │
│                 ┌────────────┐  ┌──────────┐            │
│                 │ verify API │  │chunk API │            │
│                 └────────────┘  └──────────┘            │
│                                        │                │
│                                        ▼                │
│                                 ┌──────────┐            │
│                                 │merge API │            │
│                                 └──────────┘            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      服务端 (Next.js)                     │
│                                                         │
│  tmp/chunks/{fileHash}/     tmp/uploads/                │
│  ├── 0  (分片0)             └── final.jpg (合并后文件)   │
│  ├── 1  (分片1)                                          │
│  ├── 2  (分片2)                                          │
│  └── ...                                                 │
└─────────────────────────────────────────────────────────┘
```

## 二、核心流程（6 步）

### Step 1：用户选择文件

用户通过 `<input type="file">` 选择本地文件。拿到 `File` 对象后触发上传流程。

### Step 2：文件切割

使用 `File.slice()` 将大文件按 **2MB** 为单位切割为多个 `Blob` 分片。

```ts
// File.slice(start, end) 是零拷贝操作，不会将文件加载到内存
// 它返回的是一个指向原文件指定区间的 Blob 引用
function createChunks(file: File): Blob[] {
  const chunks: Blob[] = [];
  let start = 0;
  while (start < file.size) {
    chunks.push(file.slice(start, start + CHUNK_SIZE)); // CHUNK_SIZE = 2MB
    start += CHUNK_SIZE;
  }
  return chunks;
}
```

**为什么用 `slice` 而不是读取整个文件？**
- `slice` 是零拷贝，只创建一个指向原文件某段区间的引用
- 即使文件是 10GB，也不会占用 10GB 内存
- 每个分片在需要时才通过 `FileReader` 或 `FormData` 读取

### Step 3：计算文件 MD5 哈希

使用 **SparkMD5** 库增量计算文件的 MD5 哈希值，作为文件的唯一标识。

```ts
function computeFileHash(chunks: Blob[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer(); // 创建增量哈希计算器
    const reader = new FileReader();
    let index = 0;

    reader.onload = (e) => {
      spark.append(e.target!.result as ArrayBuffer); // 追加当前分片数据到哈希
      index++;
      if (index < chunks.length) {
        reader.readAsArrayBuffer(chunks[index]); // 继续读下一个分片
      } else {
        resolve(spark.end()); // 所有分片处理完毕，输出最终哈希
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(chunks[0]); // 从第一个分片开始
  });
}
```

**为什么增量计算而不是一次性读取整个文件？**
- 一次性读取 10GB 文件会导致浏览器内存溢出
- 增量计算每次只读 2MB，内存占用恒定
- SparkMD5 的 `append()` 方法支持分块追加数据

**哈希的作用：**
- 相同文件 → 相同哈希 → 可以判断是否已上传过（秒传）
- 以哈希为目录名存储分片 → 不同文件的分片互不干扰

### Step 4：断点续传验证

上传任何分片之前，先调用 `POST /api/upload/verify` 查询服务端状态。

```
请求: { fileHash: "abc123...", fileName: "video.mp4" }
响应: { shouldUpload: true, uploadedChunks: [0, 1, 2] }
```

**三种场景：**

| 场景 | shouldUpload | uploadedChunks | 处理方式 |
|------|-------------|----------------|----------|
| 秒传 | `false` | `[]` | 文件已存在，直接标记完成 |
| 断点续传 | `true` | `[0,1,2,...]` | 跳过已上传分片，只传剩余部分 |
| 全新上传 | `true` | `[]` | 上传所有分片 |

**服务端验证逻辑：**

```ts
// 1. 检查最终文件是否已合并完成（秒传）
const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
if (fileExists) return { shouldUpload: false };

// 2. 检查已上传的分片目录（断点续传）
const files = await fs.readdir(chunkDir);  // 读取分片目录下所有文件
const uploadedChunks = files.map(Number);  // 文件名就是分片索引
return { shouldUpload: true, uploadedChunks };
```

### Step 5：并发上传分片

跳过已上传的分片，对剩余分片进行并发上传（最大并发数 = 3）。

```ts
// 并发控制：维护一个大小为 MAX_CONCURRENT 的滑动窗口
const uploadWithConcurrency = async (chunks, fileHash, indices, signal) => {
  let nextIndex = 0; // 队列指针

  const worker = async () => {
    while (nextIndex < indices.length) {
      if (pausedRef.current || signal.aborted) return; // 暂停/取消检查

      const idx = indices[nextIndex++];     // 取下一个待上传分片
      await uploadChunk(chunk, fileHash, idx, signal); // 上传
      // 更新状态为 done...
    }
  };

  // 启动 N 个 worker 并发消费队列
  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENT, indices.length) },
    () => worker()
  );
  await Promise.all(workers);
};
```

**单个分片上传：**

```ts
async function uploadChunk(chunk, fileHash, chunkIndex, signal) {
  const formData = new FormData();
  formData.append("chunk", chunk);           // 分片二进制数据
  formData.append("fileHash", fileHash);     // 文件唯一标识
  formData.append("chunkIndex", String(chunkIndex)); // 分片索引

  await fetch("/api/upload/chunk", {
    method: "POST",
    body: formData,
    signal,  // AbortController signal，支持取消
  });
}
```

**服务端接收分片：**

```ts
// 以 fileHash 为目录名，将分片存入 tmp/chunks/{fileHash}/{chunkIndex}
const chunkDir = path.join(CHUNKS_DIR, fileHash);
await fs.mkdir(chunkDir, { recursive: true });
const buffer = Buffer.from(await chunk.arrayBuffer());
await fs.writeFile(path.join(chunkDir, chunkIndex), buffer);
```

### Step 6：合并分片

所有分片上传完成后，调用 `POST /api/upload/merge` 通知服务端合并。

```ts
// 按索引顺序逐个读取分片并追加写入目标文件
for (let i = 0; i < chunkCount; i++) {
  const chunkBuffer = await fs.readFile(path.join(chunkDir, String(i)));
  await fs.appendFile(filePath, chunkBuffer);
}

// 合并完成，清理分片临时目录
await fs.rm(chunkDir, { recursive: true, force: true });
```

## 三、暂停与恢复机制

### 暂停

```ts
const pause = () => {
  pausedRef.current = true;           // 设置暂停标志
  abortRef.current?.abort();          // 取消所有正在进行的 HTTP 请求
  setState((s) => ({ ...s, phase: "paused" }));
};
```

- `AbortController.abort()` 会中断所有使用该 signal 的 `fetch` 请求
- `pausedRef.current` 标志让并发 worker 循环提前退出

### 恢复

```ts
const resume = async () => {
  pausedRef.current = false;          // 清除暂停标志
  await startUpload(fileRef.current); // 重新执行上传流程
};
```

恢复时会**重新调用 verify API**，获取最新的已上传分片列表，然后只上传剩余部分。这就是断点续传的核心 —— 不管中断了多少次，每次恢复都从上次的位置继续。

## 四、数据流图

```
用户选择文件 (100MB)
       │
       ▼
  切割为 50 个 2MB 分片
       │
       ▼
  增量计算 MD5 → "a1b2c3d4..."
       │
       ▼
  调用 verify API ─────────────────────────────────┐
       │                                            │
       ├─ 文件已存在 → 秒传完成                      │
       │                                            │
       ├─ 已上传 [0-19] → 跳过前 20 个               │
       │                                            │
       └─ 无记录 → 全部上传                          │
       │                                            │
       ▼                                            │
  并发上传剩余分片 (最多 3 个同时)                    │
  ├── 分片 20 → POST /api/upload/chunk              │
  ├── 分片 21 → POST /api/upload/chunk              │
  ├── 分片 22 → POST /api/upload/chunk              │
  │   ...                                          │
  └── 分片 49 → POST /api/upload/chunk              │
       │                                            │
       ▼                                            │
  调用 merge API ───────────────────────────────────┘
       │
       ▼
  服务端按顺序合并 50 个分片 → tmp/uploads/video.mp4
       │
       ▼
  清理 tmp/chunks/a1b2c3d4... 目录
       │
       ▼
     完成 ✓
```

## 五、服务端 API 一览

| 接口 | 方法 | 请求格式 | 作用 |
|------|------|----------|------|
| `/api/upload/verify` | POST | JSON | 查询文件是否已存在 / 已上传的分片列表 |
| `/api/upload/chunk` | POST | FormData | 接收单个分片并写入磁盘 |
| `/api/upload/merge` | POST | JSON | 合并所有分片为最终文件 |

## 六、关键设计决策

### 为什么分片大小是 2MB？

- 太小（如 100KB）→ 分片数量过多，HTTP 请求开销大
- 太大（如 50MB）→ 单片上传时间长，失败重传代价大
- 2MB 是一个平衡点：请求开销可控，失败重传代价小

### 为什么用 MD5 而不是 SHA-256？

- MD5 计算速度快（约比 SHA-256 快 3 倍）
- 此场景不需要密码学安全性，只需要文件唯一性标识
- SparkMD5 支持增量计算，适合大文件

### 为什么最大并发数是 3？

- 浏览器对同一域名的并发 HTTP 连接数限制通常是 6
- 3 个并发留出余量给其他请求（如 verify、merge）
- 过多并发会导致带宽竞争，反而降低总体速度

### 为什么用 `AbortController` 而不是布尔标志取消请求？

- 布尔标志只能阻止发起新请求，无法中断正在进行的请求
- `AbortController.abort()` 会立即中断底层 TCP 连接
- 中断后释放带宽，让暂停真正生效

## 七、文件结构

```
file-upload-demo/
├── lib/
│   └── upload-constants.ts          # 共享常量（分片大小、目录路径）
├── app/
│   ├── api/upload/
│   │   ├── chunk/route.ts           # 接收分片
│   │   ├── verify/route.ts          # 断点续传验证
│   │   └── merge/route.ts           # 合并分片
│   ├── hooks/
│   │   └── useChunkUpload.ts        # 上传核心逻辑 hook
│   ├── components/
│   │   └── FileUpload.tsx           # 上传 UI 组件
│   └── page.tsx                     # 页面入口
└── tmp/                             # 运行时生成
    ├── chunks/{fileHash}/           # 分片临时目录
    └── uploads/                     # 合并后的文件
```
