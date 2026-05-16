import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { CHUNKS_DIR } from "@/lib/upload-constants";

/**
 * POST /api/upload/chunk
 * 接收单个文件分片并写入磁盘
 *
 * 请求体 (FormData):
 *   - chunk: 文件分片二进制数据
 *   - fileHash: 文件唯一标识（MD5）
 *   - chunkIndex: 分片索引
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const chunk = formData.get("chunk") as File;
  const fileHash = formData.get("fileHash") as string;
  const chunkIndex = formData.get("chunkIndex") as string;

  if (!chunk || !fileHash || chunkIndex === undefined) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  // 以 fileHash 为目录名，将同一文件的所有分片存放在同一目录下
  const chunkDir = path.join(CHUNKS_DIR, fileHash);
  await fs.mkdir(chunkDir, { recursive: true });

  // 分片文件以索引命名，便于后续按顺序合并
  const chunkPath = path.join(chunkDir, chunkIndex);
  const buffer = Buffer.from(await chunk.arrayBuffer());
  await fs.writeFile(chunkPath, buffer);

  return NextResponse.json({ success: true, chunkIndex: Number(chunkIndex) });
}
