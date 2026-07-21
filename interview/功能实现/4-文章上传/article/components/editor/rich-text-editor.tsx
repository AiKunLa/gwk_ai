"use client";

import { Placeholder } from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { useRef, useState } from "react";

import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { ImageInspector } from "@/components/editor/image-inspector";
import { uploadImageFile } from "@/components/editor/upload-client";
import {
  assertImageCountWithinLimit,
  MAX_ARTICLE_IMAGES,
} from "@/lib/domain/image-policy";
import {
  extractImageAssetIds,
  type TiptapDocument,
} from "@/lib/domain/article-content";
import { createArticleExtensions } from "@/lib/rich-text/extensions";

interface RichTextEditorProps {
  articleId: string;
  content: TiptapDocument;
  coverAssetId: string | null;
  acquireUploadLock: () => boolean;
  releaseUploadLock: () => void;
  onChange: (content: TiptapDocument) => void;
}

interface UploadState {
  fileName: string;
  progress: number;
  error: string | null;
}

export function RichTextEditor({
  articleId,
  content,
  coverAssetId,
  acquireUploadLock,
  releaseUploadLock,
  onChange,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const editor = useEditor({
    extensions: [
      ...createArticleExtensions(),
      Placeholder.configure({ placeholder: "从这里开始写正文…" }),
    ],
    content: content as JSONContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        role: "textbox",
        "aria-label": "文章正文",
      },
      handlePaste: (_view, event) => {
        const files = [...(event.clipboardData?.files ?? [])].filter((file) =>
          file.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = [...(event.dataTransfer?.files ?? [])].filter((file) =>
          file.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        void uploadFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as TiptapDocument);
    },
  });

  async function uploadFiles(files: readonly File[]) {
    if (!editor) return;
    if (!acquireUploadLock()) {
      setUploadState({
        fileName: files[0]?.name ?? "图片",
        progress: 0,
        error: "请等待当前图片上传完成",
      });
      return;
    }

    try {
      const existingIds = extractImageAssetIds(editor.getJSON() as TiptapDocument);
      const projectedIds = [
        ...existingIds,
        ...files.map((_, index) => `pending-${index}`),
      ];
      assertImageCountWithinLimit(projectedIds, coverAssetId);

      for (const file of files) {
        setUploadState({ fileName: file.name, progress: 0, error: null });
        const asset = await uploadImageFile({
          articleId,
          file,
          onProgress: (progress) =>
            setUploadState({ fileName: file.name, progress, error: null }),
        });
        editor
          .chain()
          .focus()
          .insertContent({
            type: "articleImage",
            attrs: {
              assetId: asset.id,
              src: asset.publicUrl,
              alt: "",
              caption: "",
              align: "center",
              size: "wide",
            },
          })
          .run();
      }
      setUploadState(null);
    } catch (error) {
      setUploadState({
        fileName: files[0]?.name ?? "图片",
        progress: 0,
        error: error instanceof Error ? error.message : "图片上传失败",
      });
    } finally {
      releaseUploadLock();
    }
  }

  if (!editor) {
    return <div className="editor-loading" aria-label="正在加载编辑器" />;
  }

  return (
    <div className="editor-shell">
      <EditorToolbar editor={editor} onChooseImage={() => fileInputRef.current?.click()} />
      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        aria-label="选择正文图片"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          if (files.length > 0) void uploadFiles(files);
        }}
      />
      {uploadState && (
        <div className="upload-status" role="status">
          <span>{uploadState.error ? uploadState.error : uploadState.fileName}</span>
          {!uploadState.error && (
            <progress max={100} value={uploadState.progress}>
              {uploadState.progress}%
            </progress>
          )}
          {uploadState.error && (
            <button type="button" onClick={() => setUploadState(null)}>
              关闭
            </button>
          )}
        </div>
      )}
      <EditorContent editor={editor} />
      <ImageInspector editor={editor} />
      <div className="editor-footer">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} 字</span>
        <span>最多 {MAX_ARTICLE_IMAGES} 张图片</span>
      </div>
    </div>
  );
}
