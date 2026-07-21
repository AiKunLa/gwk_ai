import { describe, expect, it, vi } from "vitest";

import {
  uploadFormWithXhr,
  uploadImageFile,
  validateClientImage,
} from "@/components/editor/upload-client";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/domain/image-policy";

function apiResponse(data: unknown, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

describe("uploadImageFile", () => {
  it("requests a policy, uploads with progress, and confirms the object", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "diagram.png", {
      type: "image/png",
    });
    const asset = {
      id: "00000000-0000-4000-8000-000000000002",
      publicUrl: "https://cdn.example.test/diagram.png",
      status: "pending",
    };
    const readyAsset = { ...asset, status: "ready" };
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        apiResponse(
          {
            asset,
            upload: {
              uploadUrl: "https://upload.example.test",
              fields: { key: "posts/article/asset.png", policy: "signed" },
            },
          },
          201,
        ),
      )
      .mockResolvedValueOnce(apiResponse(readyAsset));
    const uploadForm = vi.fn(async (input) => {
      input.onProgress(67);
    });
    const onProgress = vi.fn();

    const result = await uploadImageFile({
      articleId: "00000000-0000-4000-8000-000000000001",
      file,
      onProgress,
      fetchImpl,
      uploadForm,
    });

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "/api/uploads",
      expect.objectContaining({ method: "POST" }),
    );
    expect(uploadForm).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadUrl: "https://upload.example.test",
        fields: { key: "posts/article/asset.png", policy: "signed" },
        file,
      }),
    );
    expect(onProgress).toHaveBeenCalledWith(67);
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      `/api/uploads/${asset.id}/complete`,
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual(readyAsset);
  });

  it("rejects unsupported and oversized files before network access", () => {
    expect(() =>
      validateClientImage(
        new File(["svg"], "vector.svg", { type: "image/svg+xml" }),
      ),
    ).toThrow();

    const oversized = {
      name: "large.png",
      type: "image/png",
      size: MAX_IMAGE_SIZE_BYTES + 1,
    } as File;
    expect(() => validateClientImage(oversized)).toThrow();
  });

  it("surfaces API errors before attempting the object-storage request", async () => {
    const file = new File(["image"], "diagram.png", { type: "image/png" });
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        { success: false, error: { message: "上传策略不可用" } },
        { status: 503 },
      ),
    );
    const uploadForm = vi.fn();

    await expect(
      uploadImageFile({
        articleId: "00000000-0000-4000-8000-000000000001",
        file,
        onProgress: vi.fn(),
        fetchImpl,
        uploadForm,
      }),
    ).rejects.toThrow("上传策略不可用");
    expect(uploadForm).not.toHaveBeenCalled();
  });
});

describe("uploadFormWithXhr", () => {
  class FakeEventTarget {
    listeners = new Map<string, (event: ProgressEvent) => void>();

    addEventListener(name: string, listener: EventListenerOrEventListenerObject) {
      const callback = typeof listener === "function"
        ? listener
        : (event: Event) => listener.handleEvent(event);
      this.listeners.set(name, callback as (event: ProgressEvent) => void);
    }

    emit(name: string, event: Partial<ProgressEvent> = {}) {
      this.listeners.get(name)?.(event as ProgressEvent);
    }
  }

  class FakeXhr extends FakeEventTarget {
    static last: FakeXhr;
    upload = new FakeEventTarget();
    status = 0;
    method = "";
    url = "";
    sentBody: Document | XMLHttpRequestBodyInit | null = null;

    constructor() {
      super();
      FakeXhr.last = this;
    }

    open(method: string, url: string) {
      this.method = method;
      this.url = url;
    }

    send(body: Document | XMLHttpRequestBodyInit | null) {
      this.sentBody = body;
    }
  }

  it("reports computable progress and resolves a successful form upload", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr);
    const onProgress = vi.fn();
    const promise = uploadFormWithXhr({
      uploadUrl: "https://upload.example.test",
      fields: { key: "posts/image.png", policy: "signed" },
      file: new File(["image"], "image.png", { type: "image/png" }),
      onProgress,
    });

    FakeXhr.last.upload.emit("progress", {
      lengthComputable: false,
      loaded: 1,
      total: 2,
    });
    FakeXhr.last.upload.emit("progress", {
      lengthComputable: true,
      loaded: 1,
      total: 2,
    });
    FakeXhr.last.status = 200;
    FakeXhr.last.emit("load");

    await expect(promise).resolves.toBeUndefined();
    expect(onProgress).toHaveBeenNthCalledWith(1, 50);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    expect(FakeXhr.last.method).toBe("POST");
    expect(FakeXhr.last.sentBody).toBeInstanceOf(FormData);
    vi.unstubAllGlobals();
  });

  it.each([
    ["load", 403, "对象存储上传失败 (403)"],
    ["error", 0, "对象存储连接失败"],
    ["abort", 0, "图片上传已取消"],
  ])("rejects the %s failure path", async (event, status, message) => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr);
    const promise = uploadFormWithXhr({
      uploadUrl: "https://upload.example.test",
      fields: {},
      file: new File(["image"], "image.png", { type: "image/png" }),
      onProgress: vi.fn(),
    });
    FakeXhr.last.status = status;
    FakeXhr.last.emit(event);

    await expect(promise).rejects.toThrow(message);
    vi.unstubAllGlobals();
  });
});
