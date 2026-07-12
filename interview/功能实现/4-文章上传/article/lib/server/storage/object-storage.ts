import type { PostObjectUpload } from "@/lib/server/storage/oss-policy";

export interface ObjectInspection {
  contentType: string | undefined;
  sizeBytes: number;
  prefix: Uint8Array;
}

export interface ObjectStorage {
  createUpload(input: {
    objectKey: string;
    contentType: string;
    now: Date;
  }): Promise<PostObjectUpload>;
  inspectObject(objectKey: string): Promise<ObjectInspection>;
  publishObject(objectKey: string): Promise<void>;
  deleteObjects(objectKeys: readonly string[]): Promise<void>;
}
