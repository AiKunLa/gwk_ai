import { fileTypeFromBuffer } from "file-type";

import { DomainError } from "@/lib/domain/errors";

export async function verifyUploadedImage(input: {
  expectedMimeType: string;
  expectedSizeBytes: number;
  actualMimeType: string | undefined;
  actualSizeBytes: number;
  prefix: Uint8Array;
}): Promise<void> {
  const actualMimeType = input.actualMimeType?.split(";", 1)[0]?.trim().toLowerCase();

  if (input.actualSizeBytes !== input.expectedSizeBytes) {
    throw new DomainError("上传图片大小与签名请求不一致", "UPLOAD_SIZE_MISMATCH");
  }

  if (actualMimeType !== input.expectedMimeType) {
    throw new DomainError("上传图片类型与签名请求不一致", "UPLOAD_MIME_MISMATCH");
  }

  const detectedType = await fileTypeFromBuffer(input.prefix);
  if (!detectedType || detectedType.mime !== input.expectedMimeType) {
    throw new DomainError("图片文件内容与扩展名不一致", "UPLOAD_CONTENT_MISMATCH");
  }
}
