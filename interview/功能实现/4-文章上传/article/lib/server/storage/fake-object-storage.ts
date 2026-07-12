import type {
  ObjectInspection,
  ObjectStorage,
} from "@/lib/server/storage/object-storage";

interface FakeObject {
  contentType: string;
  content: Uint8Array;
  isPublic: boolean;
}

const fakeGlobal = globalThis as typeof globalThis & {
  __articleFakeObjects?: Map<string, FakeObject>;
};

export const fakeObjects =
  fakeGlobal.__articleFakeObjects ?? new Map<string, FakeObject>();
fakeGlobal.__articleFakeObjects = fakeObjects;

export class FakeObjectStorage implements ObjectStorage {
  constructor(private readonly origin: string) {}

  async createUpload(input: {
    objectKey: string;
    contentType: string;
    now: Date;
  }) {
    return {
      uploadUrl: `${this.origin}/api/test-oss`,
      publicUrl: `${this.origin}/api/test-oss?key=${encodeURIComponent(input.objectKey)}`,
      expiresAt: new Date(input.now.getTime() + 120_000).toISOString(),
      fields: {
        key: input.objectKey,
        "Content-Type": input.contentType,
        "x-e2e-upload-token": process.env.E2E_FAKE_OSS_TOKEN ?? "",
        success_action_status: "200",
      },
    };
  }

  async inspectObject(objectKey: string): Promise<ObjectInspection> {
    const object = fakeObjects.get(objectKey);
    if (!object) throw new Error("Fake object not found");
    return {
      contentType: object.contentType,
      sizeBytes: object.content.byteLength,
      prefix: object.content.slice(0, 4_096),
    };
  }

  async publishObject(objectKey: string): Promise<void> {
    const object = fakeObjects.get(objectKey);
    if (!object) throw new Error("Fake object not found");
    fakeObjects.set(objectKey, { ...object, isPublic: true });
  }

  async deleteObjects(objectKeys: readonly string[]): Promise<void> {
    for (const objectKey of objectKeys) fakeObjects.delete(objectKey);
  }
}

export function putFakeObject(
  objectKey: string,
  contentType: string,
  content: Uint8Array,
): void {
  fakeObjects.set(objectKey, {
    contentType,
    content: Uint8Array.from(content),
    isPublic: false,
  });
}
