import OSS from "ali-oss";

import { DomainError } from "@/lib/domain/errors";
import type {
  ObjectInspection,
  ObjectStorage,
} from "@/lib/server/storage/object-storage";
import {
  createPostObjectUpload,
  type OssPolicyConfig,
} from "@/lib/server/storage/oss-policy";

interface AliOssConfig extends OssPolicyConfig {
  accessKeyId: string;
  accessKeySecret: string;
}

export class AliOssStorage implements ObjectStorage {
  private readonly client: OSS;

  constructor(private readonly config: AliOssConfig) {
    this.client = new OSS({
      region: config.region,
      bucket: config.bucket,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      stsToken: config.stsToken ?? undefined,
      endpoint: config.endpoint,
      secure: true,
    });
  }

  async createUpload(input: {
    objectKey: string;
    contentType: string;
    now: Date;
  }) {
    return createPostObjectUpload({
      config: this.config,
      objectKey: input.objectKey,
      contentType: input.contentType,
      now: input.now,
      calculatePostSignature: (policy) =>
        this.client.calculatePostSignature(policy),
    });
  }

  async inspectObject(objectKey: string): Promise<ObjectInspection> {
    const [head, prefixResult] = await Promise.all([
      this.client.head(objectKey),
      this.client.get(objectKey, {
        headers: { Range: "bytes=0-4095" },
      }),
    ]);
    const headers = head.res.headers as Record<string, string | string[] | undefined>;
    const contentLength = firstHeader(headers["content-length"]);
    const contentType = firstHeader(headers["content-type"]);
    const content = prefixResult.content;

    if (!contentLength || !content) {
      throw new DomainError("无法验证 OSS 图片", "OSS_INSPECTION_FAILED");
    }

    return {
      contentType,
      sizeBytes: Number(contentLength),
      prefix: content instanceof Uint8Array ? content : Buffer.from(content),
    };
  }

  async deleteObjects(objectKeys: readonly string[]): Promise<void> {
    if (objectKeys.length === 0) return;
    await Promise.all(objectKeys.map((objectKey) => this.client.delete(objectKey)));
  }

  async publishObject(objectKey: string): Promise<void> {
    await this.client.putACL(objectKey, "public-read");
  }
}

export class LazyAliOssStorage implements ObjectStorage {
  private storage: AliOssStorage | null = null;

  private getStorage(): AliOssStorage {
    if (this.storage) return this.storage;
    this.storage = new AliOssStorage(readAliOssConfig());
    return this.storage;
  }

  createUpload(input: Parameters<ObjectStorage["createUpload"]>[0]) {
    return this.getStorage().createUpload(input);
  }

  inspectObject(objectKey: string) {
    return this.getStorage().inspectObject(objectKey);
  }

  publishObject(objectKey: string) {
    return this.getStorage().publishObject(objectKey);
  }

  deleteObjects(objectKeys: readonly string[]) {
    return this.getStorage().deleteObjects(objectKeys);
  }
}

function readAliOssConfig(): AliOssConfig {
  const required = {
    region: process.env.OSS_REGION,
    bucket: process.env.OSS_BUCKET,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    publicBaseUrl: process.env.OSS_PUBLIC_BASE_URL,
  };

  if (Object.values(required).some((value) => !value)) {
    throw new DomainError(
      "对象存储尚未配置，请检查 .env.local",
      "OSS_NOT_CONFIGURED",
    );
  }

  return {
    region: required.region!,
    bucket: required.bucket!,
    accessKeyId: required.accessKeyId!,
    accessKeySecret: required.accessKeySecret!,
    publicBaseUrl: required.publicBaseUrl!,
    endpoint: process.env.OSS_ENDPOINT || undefined,
    stsToken: process.env.OSS_STS_TOKEN || null,
  };
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
