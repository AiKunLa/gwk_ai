// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { client } = vi.hoisted(() => {
  const mockedClient = {
    delete: vi.fn(),
    putACL: vi.fn(),
  };
  return { client: mockedClient };
});

vi.mock("ali-oss", () => ({
  default: function MockAliOssClient() {
    return client;
  },
}));

import { AliOssStorage } from "@/lib/server/storage/ali-oss-storage";

const config = {
  region: "oss-cn-hangzhou",
  bucket: "article-demo",
  accessKeyId: "test-key-id",
  accessKeySecret: "test-key-secret",
  publicBaseUrl: "https://cdn.example.test",
  stsToken: null,
};

describe("AliOssStorage deletion and publication", () => {
  beforeEach(() => {
    client.delete.mockReset();
    client.putACL.mockReset();
    client.delete.mockResolvedValue(undefined);
    client.putACL.mockResolvedValue(undefined);
  });

  it("publishes a verified object through its object ACL", async () => {
    const storage = new AliOssStorage(config);

    await storage.publishObject("posts/article/asset.png");

    expect(client.putACL).toHaveBeenCalledWith(
      "posts/article/asset.png",
      "public-read",
    );
  });

  it("deletes every object individually and rejects any partial failure", async () => {
    const storage = new AliOssStorage(config);
    client.delete
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("second object failed"));

    await expect(storage.deleteObjects(["first.png", "second.png"])).rejects.toThrow(
      "second object failed",
    );
    expect(client.delete).toHaveBeenCalledTimes(2);
    expect(client.delete).toHaveBeenNthCalledWith(1, "first.png");
    expect(client.delete).toHaveBeenNthCalledWith(2, "second.png");
  });
});
