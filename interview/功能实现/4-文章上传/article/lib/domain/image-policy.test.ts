import { describe, expect, it } from "vitest";

import {
  MAX_ARTICLE_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  assertImageCountWithinLimit,
  parseImageUploadIntent,
} from "@/lib/domain/image-policy";

describe("parseImageUploadIntent", () => {
  it.each([
    ["photo.jpg", "image/jpeg", "jpg"],
    ["photo.JPEG", "image/jpeg", "jpg"],
    ["photo.png", "image/png", "png"],
    ["photo.webp", "image/webp", "webp"],
    ["photo.gif", "image/gif", "gif"],
  ])("accepts %s as %s", (fileName, contentType, extension) => {
    expect(
      parseImageUploadIntent({
        fileName,
        contentType,
        sizeBytes: MAX_IMAGE_SIZE_BYTES,
      }),
    ).toEqual({
      originalName: fileName,
      contentType,
      extension,
      sizeBytes: MAX_IMAGE_SIZE_BYTES,
    });
  });

  it.each([
    [{ fileName: "empty.png", contentType: "image/png", sizeBytes: 0 }],
    [
      {
        fileName: "large.png",
        contentType: "image/png",
        sizeBytes: MAX_IMAGE_SIZE_BYTES + 1,
      },
    ],
    [{ fileName: "vector.svg", contentType: "image/svg+xml", sizeBytes: 10 }],
    [{ fileName: "fake.jpg", contentType: "image/png", sizeBytes: 10 }],
    [{ fileName: "../photo.png", contentType: "image/png", sizeBytes: 10 }],
  ])("rejects an unsafe image intent", (input) => {
    expect(() => parseImageUploadIntent(input)).toThrow();
  });
});

describe("assertImageCountWithinLimit", () => {
  it("counts unique body and cover assets together", () => {
    const bodyAssetIds = Array.from(
      { length: MAX_ARTICLE_IMAGES },
      (_, index) => `asset-${index}`,
    );

    expect(() =>
      assertImageCountWithinLimit(bodyAssetIds, "asset-0"),
    ).not.toThrow();
    expect(() =>
      assertImageCountWithinLimit(bodyAssetIds, "cover-extra"),
    ).toThrow();
  });
});
