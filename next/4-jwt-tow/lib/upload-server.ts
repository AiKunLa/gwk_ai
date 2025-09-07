import { rejects } from "assert";
import {
  mkdirSync,
  existsSync,
  createWriteStream,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, resolve } from "path";
import { json } from "stream/consumers";

// 获取当前执行命令所在的目录路径，用于定位
const ROOT = process.cwd();
const UPLOAD_DIR = join(ROOT, "uploads");

//
export type Meta = {
  fileName: string;
  fileSize: number;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  complete: boolean;
  finalPath?: string;
};

// 拼接chunk的存储路径
export const getUploadDir = (fileHash: string) => {
  const dir = join(UPLOAD_DIR, fileHash);
  const chunkDir = join(dir, "chunks");
  return {
    dir,
    chunkDir,
  };
};

// 创建文件夹
export const ensureUploadDirs = (fileHash: string) => {
  const { dir, chunkDir } = getUploadDir(fileHash);

  // 若没有相应目录则建立
  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR);
  if (!existsSync(dir)) mkdirSync(dir);
  if (!existsSync(chunkDir)) mkdirSync(chunkDir);

  return {
    dir,
    chunkDir,
  };
};

// 保存分片
export const saveChunk = async (
  fileHash: string,
  chunkIndex: number,
  blob: Buffer
) => {
  // 确保基于文件哈希值的分片存储目录存在
  const { chunkDir } = ensureUploadDirs(fileHash);
  const filePath = join(chunkDir, `${chunkIndex}.part`);
  // 创建写入流
  const strem = createWriteStream(filePath);
  return new Promise<void>((resolve, reject) => {
    //当写入过程中发生错误时，Promise 被拒绝并传递错误信息
    strem.on("error", reject);
    //当所有数据写入完成并关闭流时，Promise 被解析，表示保存成功
    strem.on("finish", () => resolve());
    // 通过 strem.end(blob) 将二进制数据写入文件并关闭流
    strem.end(blob);
  });
};

// 获取meta.json 文件路径，这个文件中存储了上传文件的信息
export function metaPath(fileHash: string) {
  return join(getUploadDir(fileHash).dir, "meta.json");
}

// 读取文件
export function readMeta(fileHash: string): Meta | null {
  // 获取描述文件路径
  const p = metaPath(fileHash);
  if (!existsSync(p)) return null;
  const raw = readFileSync(p, "utf-8");
  return JSON.parse(raw) as Meta;
}

// 写入文件
export function writeMeta(fileHash: string, meta: Meta) {
  // 第二个参数表示不使用replacer函数或者过滤，replacer的作用是可以去除敏感字段或转换类型
  writeFileSync(metaPath(fileHash), JSON.stringify(meta, null, 2));
}

export function listUploadedChunks(fileHash: string): number[] {
  const { chunkDir } = getUploadDir(fileHash);
  if (!existsSync(chunkDir)) return [];
  // 读取切片文件夹
  const files = readdirSync(chunkDir);
  // 获取已经上传文件名称id
  const ids = files
    .map((f) => Number(f.split(".")[0]))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
  return ids;
}

// 获取文件最终存储的完整路径
// @param fileHash - 文件的哈希值，用于定位文件存储目录
// @param fileName - 文件名，指定最终存储的文件名
export function finalFilePath(fileHash: string, fileName: string) {
  const { dir } = getUploadDir(fileHash);
  return join(dir, fileName);
}

// 检查文件是否已经存在且文件大小大于 0
// @param fileHash - 文件的哈希值，用于定位文件存储目录
// @param fileName - 文件名，指定要检查的文件名
// @returns 如果文件存在且大小大于 0 返回 true，否则返回 false
export function fileAlreadyExist(fileHash: string, fileName: string) {
  const p = finalFilePath(fileHash, fileName);
  return existsSync(p) && statSync(p).size > 0;
}

export function mergeChunks(
  fileHash: string,
  fileName: string,
  totalChunks: number
) {
  const { chunkDir } = getUploadDir(fileHash);
  const target = finalFilePath(fileHash, fileName);
  const ws = createWriteStream(target);

  for (let i = 0; i < totalChunks; i++) {
    const p = join(chunkDir, `${i}.part`);
    // 若没有该切片
    if (!existsSync(p)) throw new Error(`缺少分片：${i}`);
    // 读取完毕之后才写入，同步读取
    const data = readFileSync(p);
    ws.write(data); // 异步写入，
  }

  // 要注意关掉写入流
  ws.end();
  return new Promise((resolve, reject) => {
    ws.on("finish", () => resolve(target));
    ws.on("error", reject);
  });
}
