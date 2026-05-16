import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { CHUNKS_DIR, UPLOADS_DIR } from "@/lib/upload-constants";

/**
 * POST /api/upload/verify
 * 断点续传核心：检查文件是否已存在或哪些分片已上传
 *
 * 请求体 (JSON):
 *   - fileHash: 文件唯一标识（MD5）
 *   - fileName: 文件名（用于检查最终文件是否已合并）
 *
 * 返回:
 *   - shouldUpload: false 表示文件已存在（秒传），true 表示需要上传
 *   - uploadedChunks: 已上传的分片索引列表（续传时跳过这些分片）
 */
export async function POST(request: NextRequest) {
  const { fileHash, fileName } = await request.json();

  if (!fileHash || !fileName) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  // 检查最终文件是否已经合并完成（秒传场景）
  const filePath = path.join(UPLOADS_DIR, fileName);
  const fileExists = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    return NextResponse.json({ shouldUpload: false, uploadedChunks: [] });
  }

  // 检查已上传的分片（断点续传场景）
  const chunkDir = path.join(CHUNKS_DIR, fileHash);
  let uploadedChunks: number[] = [];

  try {
    const files = await fs.readdir(chunkDir);
    // 文件名就是分片索引，读取所有已存在的分片索引
    uploadedChunks = files.map(Number).sort((a, b) => a - b);
  } catch {
    // 目录不存在说明还没有任何分片上传
  }

  return NextResponse.json({ shouldUpload: true, uploadedChunks });
}
