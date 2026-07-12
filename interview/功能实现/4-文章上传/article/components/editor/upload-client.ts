import { parseImageUploadIntent } from "@/lib/domain/image-policy";

export interface UploadedAsset {
  id: string;
  publicUrl: string;
  status: "pending" | "ready";
  [key: string]: unknown;
}

interface UploadIntentResponse {
  asset: UploadedAsset;
  upload: {
    uploadUrl: string;
    fields: Record<string, string>;
  };
}

export interface UploadFormInput {
  uploadUrl: string;
  fields: Record<string, string>;
  file: File;
  onProgress: (progress: number) => void;
}

type UploadForm = (input: UploadFormInput) => Promise<void>;

export function validateClientImage(file: File): void {
  parseImageUploadIntent({
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  });
}

export async function uploadImageFile(input: {
  articleId: string;
  file: File;
  onProgress: (progress: number) => void;
  fetchImpl?: typeof fetch;
  uploadForm?: UploadForm;
}): Promise<UploadedAsset> {
  validateClientImage(input.file);
  const fetchImpl = input.fetchImpl ?? fetch;
  const uploadForm = input.uploadForm ?? uploadFormWithXhr;
  const intent = await requestJson<UploadIntentResponse>(
    fetchImpl,
    "/api/uploads",
    {
      articleId: input.articleId,
      fileName: input.file.name,
      contentType: input.file.type,
      sizeBytes: input.file.size,
    },
  );

  await uploadForm({
    uploadUrl: intent.upload.uploadUrl,
    fields: intent.upload.fields,
    file: input.file,
    onProgress: input.onProgress,
  });

  return requestJson<UploadedAsset>(
    fetchImpl,
    `/api/uploads/${intent.asset.id}/complete`,
    {},
  );
}

export function uploadFormWithXhr(input: UploadFormInput): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", input.uploadUrl);
    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      input.onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        input.onProgress(100);
        resolve();
        return;
      }
      reject(new Error(`对象存储上传失败 (${request.status})`));
    });
    request.addEventListener("error", () => reject(new Error("对象存储连接失败")));
    request.addEventListener("abort", () => reject(new Error("图片上传已取消")));

    const form = new FormData();
    for (const [key, value] of Object.entries(input.fields)) {
      form.append(key, value);
    }
    form.append("file", input.file);
    request.send(form);
  });
}

async function requestJson<T>(
  fetchImpl: typeof fetch,
  url: string,
  body: unknown,
): Promise<T> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: { message?: string };
  };

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message || "图片上传失败");
  }
  return payload.data;
}
