// @vitest-environment node

import { describe, expect, it } from "vitest";

import { verifyUploadedImage } from "@/lib/server/storage/upload-verification";

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nGQAAAAASUVORK5CYII=",
  "base64",
);

describe("verifyUploadedImage", () => {
  it("accepts metadata and magic bytes that match the upload intent", async () => {
    await expect(
      verifyUploadedImage({
        expectedMimeType: "image/png",
        expectedSizeBytes: onePixelPng.byteLength,
        actualMimeType: "image/png",
        actualSizeBytes: onePixelPng.byteLength,
        prefix: onePixelPng,
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects a changed size, header MIME, or spoofed file body", async () => {
    await expect(
      verifyUploadedImage({
        expectedMimeType: "image/png",
        expectedSizeBytes: onePixelPng.byteLength,
        actualMimeType: "image/png",
        actualSizeBytes: onePixelPng.byteLength + 1,
        prefix: onePixelPng,
      }),
    ).rejects.toThrow();

    await expect(
      verifyUploadedImage({
        expectedMimeType: "image/png",
        expectedSizeBytes: onePixelPng.byteLength,
        actualMimeType: "image/jpeg",
        actualSizeBytes: onePixelPng.byteLength,
        prefix: onePixelPng,
      }),
    ).rejects.toThrow();

    await expect(
      verifyUploadedImage({
        expectedMimeType: "image/png",
        expectedSizeBytes: 6,
        actualMimeType: "image/png",
        actualSizeBytes: 6,
        prefix: Buffer.from("GIF89a"),
      }),
    ).rejects.toThrow();
  });
});
