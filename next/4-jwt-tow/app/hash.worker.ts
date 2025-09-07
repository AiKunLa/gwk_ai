export type HashWorkerIn = {
  type: "HASH";
  file: File;
  chunkSize: number;
};

/**
 * 联合类型
 */
export type HashWorkerOut =
  | {
      type: "DONE";
      hash: string;
    }
  | {
      type: "PROGRESS";
      process: number;
    };

async function sha256ArrayBuffer(buf: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

self.onmessage = async (e: MessageEvent<HashWorkerIn>) => {
  const msg = e.data;
  if (msg.type === "HASH") {
    const { file, chunkSize } = msg;
    const total = Math.ceil(file.size / chunkSize);
    // 二进制缓存区，用于处理文件
    const chunks: ArrayBuffer[] = [];
    // 进行文件的切片，并存储到缓存区
    for (let i = 0; i < total; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);
      // 将chunk转为二进制格式
      const buf = await chunk.arrayBuffer();
      chunks.push(buf);
      (self as any).postMessage({
        type: "PROGRESS",
        process: (i + 1) / total,
      } as HashWorkerOut);
    }
    // 这行代码将多个数据块 chunks 合并，创建成一个完整的二进制对象 Blob，
    const whole = new Blob(chunks);
    // whole.arrayBuffer()会返回一个 Promise
    // 该 Promise 在解析后返回包含 Blob 全部数据的、只读的 ArrayBuffer
    const hash = await sha256ArrayBuffer(await whole.arrayBuffer());
    (self as any).postMessage({
      type: "DONE",
      hash,
    } as HashWorkerOut);
  }
};
