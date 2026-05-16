"use client";

import { useRef } from "react";
import { useChunkUpload } from "@/app/hooks/useChunkUpload";

/** 格式化文件大小为人类可读字符串 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * 大文件分片上传组件
 *
 * 核心流程：
 * 1. 用户选择文件 → 切割为 2MB 分片
 * 2. 增量计算文件 MD5 哈希（作为文件唯一标识）
 * 3. 将哈希发送给服务端，查询已上传的分片（断点续传）
 * 4. 跳过已上传分片，仅上传剩余分片
 * 5. 全部上传完成后，通知服务端合并分片为完整文件
 */
export default function FileUpload() {
  const { state, startUpload, pause, resume, cancel } = useChunkUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startUpload(file);
      // 清空 input 以便重复选择同一文件
      e.target.value = "";
    }
  };

  // 计算总进度百分比
  const totalChunks = state.chunks.length;
  const overallPercent =
    totalChunks > 0
      ? Math.round((state.completedCount / totalChunks) * 100)
      : 0;

  // 按状态分组统计分片数量
  const uploadingCount = state.chunks.filter(
    (c) => c.status === "uploading"
  ).length;
  const doneCount = state.chunks.filter((c) => c.status === "done").length;
  const errorCount = state.chunks.filter((c) => c.status === "error").length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 操作按钮区 */}
      <div className="flex gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={state.phase === "uploading" || state.phase === "hashing"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          选择文件
        </button>

        {state.phase === "uploading" && (
          <button
            onClick={pause}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            暂停
          </button>
        )}

        {state.phase === "paused" && (
          <button
            onClick={resume}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            继续上传
          </button>
        )}

        {(state.phase === "uploading" ||
          state.phase === "paused" ||
          state.phase === "error") && (
          <button
            onClick={cancel}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            取消
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 哈希计算进度 */}
      {state.phase === "hashing" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            正在计算文件哈希（用于断点续传标识）...
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${state.hashProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 文件信息和总进度 */}
      {state.fileHash && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">文件哈希</span>
            <span className="font-mono text-xs truncate ml-4 max-w-[300px]">
              {state.fileHash}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">总分片数</span>
            <span>{totalChunks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">上传进度</span>
            <span>
              {state.completedCount} / {totalChunks} ({overallPercent}%)
            </span>
          </div>
          {uploadingCount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">正在上传</span>
              <span className="text-blue-500">{uploadingCount} 个分片</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">失败</span>
              <span className="text-red-500">{errorCount} 个分片</span>
            </div>
          )}
        </div>
      )}

      {/* 总进度条 */}
      {state.phase === "uploading" && totalChunks > 0 && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 分片状态网格（可视化每个分片的上传状态） */}
      {state.chunks.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            分片状态（每个方块代表一个 2MB 分片）
          </p>
          <div className="flex flex-wrap gap-1">
            {state.chunks.map((chunk) => {
              const bg =
                chunk.status === "done"
                  ? "bg-green-500"
                  : chunk.status === "uploading"
                    ? "bg-blue-500 animate-pulse"
                    : chunk.status === "error"
                      ? "bg-red-500"
                      : "bg-gray-300 dark:bg-gray-600";
              return (
                <div
                  key={chunk.index}
                  className={`w-3 h-3 rounded-sm ${bg} transition-colors`}
                  title={`分片 ${chunk.index}: ${chunk.status}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 完成提示 */}
      {state.phase === "done" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 font-medium">
            上传完成！文件已成功合并。
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {state.phase === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{state.error}</p>
          <button
            onClick={resume}
            className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            重试
          </button>
        </div>
      )}

      {/* 使用说明 */}
      <div className="text-xs text-gray-400 space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>原理说明：</p>
        <p>1. 使用 File.slice() 将大文件切割为 2MB 的分片</p>
        <p>2. 使用 SparkMD5 增量计算文件 MD5 作为唯一标识</p>
        <p>3. 上传前先向服务端查询已上传的分片（断点续传）</p>
        <p>4. 仅上传缺失的分片，并发数为 3</p>
        <p>5. 全部上传完成后通知服务端按顺序合并分片</p>
      </div>
    </div>
  );
}
