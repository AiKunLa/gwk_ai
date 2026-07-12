import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadImageFile } from "@/components/editor/upload-client";
import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/domain/article-content";

vi.mock("@/components/editor/upload-client", () => ({
  uploadImageFile: vi.fn(),
}));

describe("RichTextEditor", () => {
  beforeEach(() => {
    vi.mocked(uploadImageFile).mockReset();
  });

  it("renders an accessible Tiptap toolbar and emits JSON updates", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RichTextEditor
        articleId="00000000-0000-4000-8000-000000000001"
        content={EMPTY_TIPTAP_DOCUMENT}
        coverAssetId={null}
        acquireUploadLock={() => true}
        releaseUploadLock={vi.fn()}
        onChange={onChange}
      />,
    );

    expect(await screen.findByRole("button", { name: "粗体" })).toBeVisible();
    expect(screen.getByRole("button", { name: "插入图片" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "文本样式" })).toBeVisible();

    const editor = await screen.findByRole("textbox", { name: "文章正文" });
    await user.click(screen.getByRole("button", { name: "粗体" }));
    await user.click(editor);
    await user.type(editor, "Hello Tiptap");

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.lastCall?.[0]).toMatchObject({ type: "doc" });
  });

  it("counts an explicit cover before starting a body image upload", async () => {
    const user = userEvent.setup();
    const content = {
      type: "doc",
      content: Array.from({ length: 19 }, (_, index) => ({
        type: "articleImage",
        attrs: {
          assetId: `asset-${index}`,
          src: `https://cdn.example.test/asset-${index}.png`,
        },
      })),
    } as const;

    render(
      <RichTextEditor
        articleId="00000000-0000-4000-8000-000000000001"
        content={content}
        coverAssetId="cover-asset"
        acquireUploadLock={() => true}
        releaseUploadLock={vi.fn()}
        onChange={vi.fn()}
      />,
    );

    await user.upload(
      await screen.findByLabelText("选择正文图片"),
      new File(["image"], "extra.png", { type: "image/png" }),
    );

    expect(await screen.findByText("每篇文章最多使用 20 张图片")).toBeVisible();
    expect(uploadImageFile).not.toHaveBeenCalled();
  });

  it("rejects a concurrent upload while another image is pending", async () => {
    const user = userEvent.setup();
    const firstUpload = Promise.withResolvers<{
      id: string;
      publicUrl: string;
      status: "ready";
    }>();
    vi.mocked(uploadImageFile).mockReturnValueOnce(firstUpload.promise);
    let isLocked = false;
    const acquireUploadLock = vi.fn(() => {
      if (isLocked) return false;
      isLocked = true;
      return true;
    });
    const releaseUploadLock = vi.fn(() => {
      isLocked = false;
    });

    render(
      <RichTextEditor
        articleId="00000000-0000-4000-8000-000000000001"
        content={EMPTY_TIPTAP_DOCUMENT}
        coverAssetId={null}
        acquireUploadLock={acquireUploadLock}
        releaseUploadLock={releaseUploadLock}
        onChange={vi.fn()}
      />,
    );
    const input = await screen.findByLabelText("选择正文图片");

    await user.upload(input, new File(["first"], "first.png", { type: "image/png" }));
    await waitFor(() => expect(uploadImageFile).toHaveBeenCalledTimes(1));
    await user.upload(input, new File(["second"], "second.png", { type: "image/png" }));

    expect(await screen.findByText("请等待当前图片上传完成")).toBeVisible();
    expect(uploadImageFile).toHaveBeenCalledTimes(1);

    firstUpload.resolve({
      id: "asset-first",
      publicUrl: "https://cdn.example.test/asset-first.png",
      status: "ready",
    });
    await waitFor(() => expect(releaseUploadLock).toHaveBeenCalledTimes(1));
  });
});
