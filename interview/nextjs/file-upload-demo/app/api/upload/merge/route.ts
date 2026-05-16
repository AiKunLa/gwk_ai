import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { CHUNKS_DIR, UPLOADS_DIR } from "@/lib/upload-constants";

/**
 * POST /api/upload/merge
 * 将所有分片按顺序合并为最终文件
 *
 * 请求体 (JSON):
 *   - fileHash: 文件唯一标识（MD5）
 *   - fileName: 最终文件名
 *   - chunkCount: 分片总数
 */
export async function POST(request: NextRequest) {
  const { fileHash, fileName, chunkCount } = await request.json();

  if (!fileHash || !fileName || !chunkCount) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  const chunkDir = path.join(CHUNKS_DIR, fileHash);
  const filePath = path.join(UPLOADS_DIR, fileName);

  // 确保输出目录存在
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  // 按索引顺序逐个读取分片并追加写入目标文件
  for (let i = 0; i < chunkCount; i++) {
    const chunkPath = path.join(chunkDir, String(i));
    const chunkBuffer = await fs.readFile(chunkPath);
    await fs.appendFile(filePath, chunkBuffer);
  }

  // 合并完成，清理分片临时目录
  await fs.rm(chunkDir, { recursive: true, force: true });

  return NextResponse.json({ success: true, filePath });
}
