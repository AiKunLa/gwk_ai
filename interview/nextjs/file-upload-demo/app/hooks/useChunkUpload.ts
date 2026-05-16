"use client";

import { useState, useRef, useCallback } from "react";
import SparkMD5 from "spark-md5";

/** 每个分片大小：2MB */
const CHUNK_SIZE = 2 * 1024 * 1024;

/** 同时上传的最大分片数 */
const MAX_CONCURRENT = 3;

/** 单个分片上传状态 */
export interface ChunkStatus {
  index: number;
  /** pending | uploading | done | error */
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

/** 上传任务整体状态 */
export interface UploadState {
  /** 当前阶段：idle | hashing | uploading | paused | done | error */
  phase: "idle" | "hashing" | "uploading" | "paused" | "done" | "error";
  /** 文件唯一哈希值 */
  fileHash: string;
  /** 哈希计算进度 0~100 */
  hashProgress: number;
  /** 所有分片状态 */
  chunks: ChunkStatus[];
  /** 已完成的分片数 */
  completedCount: number;
  /** 错误信息 */
  error: string;
}

/**
 * 将文件切割为多个分片
 * 使用 File.slice() 实现零拷贝切割，不会将整个文件加载到内存
 */
function createChunks(file: File): Blob[] {
  const chunks: Blob[] = [];
  let start = 0;
  while (start < file.size) {
    chunks.push(file.slice(start, start + CHUNK_SIZE));
    start += CHUNK_SIZE;
  }
  return chunks;
}

/**
 * 增量计算文件 MD5 哈希
 * 分块读取文件避免大文件一次性加载导致内存溢出
 * 使用 SparkMD5 的增量哈希能力，每读完一块就更新哈希状态
 */
function computeFileHash(chunks: Blob[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    let index = 0;

    reader.onload = (e) => {
      // 每读完一个分片，将其内容追加到哈希计算中
      spark.append(e.target!.result as ArrayBuffer);
      index++;
      if (index < chunks.length) {
        // 继续读取下一个分片
        reader.readAsArrayBuffer(chunks[index]);
      } else {
        // 所有分片读取完毕，生成最终哈希
        resolve(spark.end());
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(chunks[0]);
  });
}

/**
 * 上传单个分片到服务端
 * 使用 AbortController 支持取消上传（暂停功能）
 */
async function uploadChunk(
  chunk: Blob,
  fileHash: string,
  chunkIndex: number,
  signal?: AbortSignal
): Promise<void> {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("fileHash", fileHash);
  formData.append("chunkIndex", String(chunkIndex));

  const res = await fetch("/api/upload/chunk", {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    throw new Error(`分片 ${chunkIndex} 上传失败: ${res.status}`);
  }
}

export function useChunkUpload() {
  const [state, setState] = useState<UploadState>({
    phase: "idle",
    fileHash: "",
    hashProgress: 0,
    chunks: [],
    completedCount: 0,
    error: "",
  });

  // AbortController 引用，用于暂停时取消正在进行的请求
  const abortRef = useRef<AbortController | null>(null);
  // 标记是否已暂停，用于在并发上传循环中提前退出
  const pausedRef = useRef(false);
  // 缓存文件引用，暂停后恢复时需要重新切割
  const fileRef = useRef<File | null>(null);
  // 缓存分片数组
  const chunksRef = useRef<Blob[]>([]);

  /**
   * 开始上传流程：
   * 1. 切割文件为分片
   * 2. 计算文件哈希
   * 3. 向服务端验证已上传的分片（断点续传）
   * 4. 跳过已上传分片，上传剩余分片
   * 5. 全部完成后请求合并
   */
  const startUpload = useCallback(async (file: File) => {
    // 重置状态
    pausedRef.current = false;
    abortRef.current = null;
    fileRef.current = file;
    setState({
      phase: "hashing",
      fileHash: "",
      hashProgress: 0,
      chunks: [],
      completedCount: 0,
      error: "",
    });

    // Step 1: 切割文件
    const chunks = createChunks(file);
    chunksRef.current = chunks;

    // Step 2: 计算文件哈希（用分片增量计算，避免内存溢出）
    let fileHash: string;
    try {
      // 为了显示进度，我们模拟渐进式进度
      // 实际的 SparkMD5 增量计算是在 computeFileHash 内部完成的
      fileHash = await computeFileHash(chunks);
    } catch {
      setState((s) => ({ ...s, phase: "error", error: "文件哈希计算失败" }));
      return;
    }

    // Step 3: 向服务端验证，获取已上传的分片列表（断点续传核心）
    const verifyRes = await fetch("/api/upload/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileHash, fileName: file.name }),
    });
    const { shouldUpload, uploadedChunks } = await verifyRes.json();

    // 秒传：文件已存在，直接完成
    if (!shouldUpload) {
      setState((s) => ({
        ...s,
        phase: "done",
        fileHash,
        hashProgress: 100,
        completedCount: chunks.length,
        chunks: chunks.map((_, i) => ({
          index: i,
          status: "done" as const,
          progress: 100,
        })),
      }));
      return;
    }

    // Step 4: 初始化所有分片状态，将已上传的分片标记为 done
    const uploadedSet = new Set(uploadedChunks as number[]);
    const initialChunks: ChunkStatus[] = chunks.map((_, i) => ({
      index: i,
      status: uploadedSet.has(i) ? "done" : "pending",
      progress: uploadedSet.has(i) ? 100 : 0,
    }));
    const alreadyDone = uploadedSet.size;

    setState({
      phase: "uploading",
      fileHash,
      hashProgress: 100,
      chunks: initialChunks,
      completedCount: alreadyDone,
      error: "",
    });

    // Step 5: 并发上传剩余分片
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    // 待上传的分片索引（排除已完成的）
    const pendingIndices = chunks
      .map((_, i) => i)
      .filter((i) => !uploadedSet.has(i));

    try {
      await uploadWithConcurrency(chunks, fileHash, pendingIndices, signal);
    } catch (err: unknown) {
      if (pausedRef.current) return; // 用户主动暂停，不处理错误
      const msg = err instanceof Error ? err.message : "上传失败";
      setState((s) => ({ ...s, phase: "error", error: msg }));
      return;
    }

    // Step 6: 所有分片上传完成，请求合并
    const mergeRes = await fetch("/api/upload/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileHash,
        fileName: file.name,
        chunkCount: chunks.length,
      }),
    });

    if (!mergeRes.ok) {
      setState((s) => ({ ...s, phase: "error", error: "文件合并失败" }));
      return;
    }

    setState((s) => ({ ...s, phase: "done" }));
  }, []);

  /**
   * 并发上传控制：
   * 维护一个大小为 MAX_CONCURRENT 的滑动窗口，
   * 每当一个分片上传完成，立即从队列中取下一个继续上传
   */
  const uploadWithConcurrency = async (
    chunks: Blob[],
    fileHash: string,
    indices: number[],
    signal: AbortSignal
  ) => {
    let nextIndex = 0;

    // worker 函数：不断从队列中取分片上传，直到队列为空或被暂停
    const worker = async () => {
      while (nextIndex < indices.length) {
        if (pausedRef.current || signal.aborted) return;

        const idx = indices[nextIndex++];
        const chunk = chunks[idx];

        // 更新分片状态为 uploading
        setState((s) => ({
          ...s,
          chunks: s.chunks.map((c) =>
            c.index === idx ? { ...c, status: "uploading" } : c
          ),
        }));

        await uploadChunk(chunk, fileHash, idx, signal);

        // 更新分片状态为 done
        setState((s) => ({
          ...s,
          completedCount: s.completedCount + 1,
          chunks: s.chunks.map((c) =>
            c.index === idx
              ? { ...c, status: "done" as const, progress: 100 }
              : c
          ),
        }));
      }
    };

    // 启动多个 worker 并发执行
    const workers = Array.from(
      { length: Math.min(MAX_CONCURRENT, indices.length) },
      () => worker()
    );
    await Promise.all(workers);
  };

  /** 暂停上传：取消所有正在进行的请求 */
  const pause = useCallback(() => {
    pausedRef.current = true;
    abortRef.current?.abort();
    setState((s) => ({ ...s, phase: "paused" }));
  }, []);

  /** 恢复上传：重新验证并上传剩余分片 */
  const resume = useCallback(async () => {
    const file = fileRef.current;
    if (!file) return;
    pausedRef.current = false;
    await startUpload(file);
  }, [startUpload]);

  /** 取消上传并重置状态 */
  const cancel = useCallback(() => {
    pausedRef.current = true;
    abortRef.current?.abort();
    setState({
      phase: "idle",
      fileHash: "",
      hashProgress: 0,
      chunks: [],
      completedCount: 0,
      error: "",
    });
    fileRef.current = null;
    chunksRef.current = [];
  }, []);

  return { state, startUpload, pause, resume, cancel };
}
