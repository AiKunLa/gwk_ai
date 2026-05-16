import path from "path";

/** 每个分片的大小：2MB */
export const CHUNK_SIZE = 2 * 1024 * 1024;

/** 分片临时存储目录 */
export const CHUNKS_DIR = path.join(process.cwd(), "tmp", "chunks");

/** 合并后的文件存储目录 */
export const UPLOADS_DIR = path.join(process.cwd(), "tmp", "uploads");
