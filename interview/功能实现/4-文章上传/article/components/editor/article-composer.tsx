"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Eye,
  ImagePlus,
  LoaderCircle,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadImageFile } from "@/components/editor/upload-client";
import {
  extractImageAssetIds,
  type TiptapDocument,
} from "@/lib/domain/article-content";
import { assertImageCountWithinLimit } from "@/lib/domain/image-policy";
import type { ArticleView } from "@/lib/server/services/article-service";

const AUTOSAVE_INTERVAL_MS = 15_000;

interface DraftState {
  title: string;
  summary: string;
  tagsText: string;
  content: TiptapDocument;
  coverAssetId: string | null;
  coverUrl: string | null;
}

type SaveState = "saved" | "dirty" | "saving" | "error" | "conflict";

export function ArticleComposer({ article }: { article: ArticleView }) {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftState>({
    title: article.title,
    summary: article.summary,
    tagsText: article.tags.join(", "),
    content: article.content,
    coverAssetId: article.coverAssetId,
    coverUrl: article.coverAssetId ? article.effectiveCoverUrl : null,
  });
  const [revision, setRevision] = useState(article.revision);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [saveMessage, setSaveMessage] = useState("已保存");
  const [coverProgress, setCoverProgress] = useState<number | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef(draft);
  const revisionRef = useRef(revision);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const saveQueueRef = useRef<Promise<boolean>>(Promise.resolve(true));
  const imageUploadLockedRef = useRef(false);
  const imageUploadIdleRef = useRef<Promise<void>>(Promise.resolve());
  const resolveImageUploadIdleRef = useRef<(() => void) | null>(null);
  const deletingRef = useRef(false);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    revisionRef.current = revision;
  }, [revision]);

  const updateDraft = useCallback((update: Partial<DraftState>) => {
    const nextDraft = { ...draftRef.current, ...update };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    dirtyRef.current = true;
    setSaveState("dirty");
    setSaveMessage("未保存");
  }, []);

  const acquireImageUploadLock = useCallback(() => {
    if (deletingRef.current || imageUploadLockedRef.current) return false;
    imageUploadLockedRef.current = true;
    imageUploadIdleRef.current = new Promise<void>((resolve) => {
      resolveImageUploadIdleRef.current = resolve;
    });
    setIsUploading(true);
    return true;
  }, []);

  const releaseImageUploadLock = useCallback(() => {
    if (!imageUploadLockedRef.current) return;
    imageUploadLockedRef.current = false;
    setIsUploading(false);
    resolveImageUploadIdleRef.current?.();
    resolveImageUploadIdleRef.current = null;
  }, []);

  const waitForImageUpload = useCallback(
    () => imageUploadIdleRef.current,
    [],
  );

  const performSave = useCallback(async (action: "draft" | "publish") => {
    savingRef.current = true;
    dirtyRef.current = false;
    setSaveState("saving");
    setSaveMessage(action === "publish" ? "发布中" : "保存中");
    const snapshot = draftRef.current;

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: revisionRef.current,
          action,
          title: snapshot.title,
          summary: snapshot.summary,
          tags: snapshot.tagsText
            .split(/[,，]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
          content: snapshot.content,
          coverAssetId: snapshot.coverAssetId,
        }),
      });
      const payload = (await response.json()) as {
        success: boolean;
        data?: ArticleView;
        error?: { code?: string; message?: string };
      };
      if (!response.ok || !payload.success || !payload.data) {
        const error = new Error(payload.error?.message || "保存失败");
        Object.assign(error, { code: payload.error?.code });
        throw error;
      }

      revisionRef.current = payload.data.revision;
      setRevision(payload.data.revision);
      setSaveState(dirtyRef.current ? "dirty" : "saved");
      setSaveMessage(dirtyRef.current ? "有新修改" : action === "publish" ? "已发布" : "已保存");
      router.refresh();
      return true;
    } catch (error) {
      dirtyRef.current = true;
      const isConflict = (error as { code?: string }).code === "REVISION_CONFLICT";
      setSaveState(isConflict ? "conflict" : "error");
      setSaveMessage(error instanceof Error ? error.message : "保存失败");
      return false;
    } finally {
      savingRef.current = false;
    }
  }, [article.id, router]);

  const save = useCallback((action: "draft" | "publish") => {
    const runSave = async () => {
      let mustSave = action === "publish";

      while (true) {
        await waitForImageUpload();
        if (!mustSave && !dirtyRef.current) return true;

        const saved = await performSave(action);
        if (!saved) return false;
        mustSave = false;

        await waitForImageUpload();
        if (!dirtyRef.current) return true;
      }
    };
    const queuedSave = saveQueueRef.current.then(runSave, runSave);
    saveQueueRef.current = queuedSave;
    return queuedSave;
  }, [performSave, waitForImageUpload]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (dirtyRef.current && !savingRef.current) void save("draft");
    }, AUTOSAVE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [save]);

  async function uploadCover(file: File) {
    setCoverError(null);
    if (!acquireImageUploadLock()) {
      setCoverError("请等待当前图片上传完成");
      return;
    }
    setCoverProgress(0);
    try {
      assertImageCountWithinLimit(
        extractImageAssetIds(draftRef.current.content),
        "pending-cover",
      );
      const asset = await uploadImageFile({
        articleId: article.id,
        file,
        onProgress: setCoverProgress,
      });
      updateDraft({ coverAssetId: asset.id, coverUrl: asset.publicUrl });
      setCoverProgress(null);
    } catch (error) {
      setCoverError(error instanceof Error ? error.message : "封面上传失败");
      setCoverProgress(null);
    } finally {
      releaseImageUploadLock();
    }
  }

  async function preview() {
    const saved = await save("draft");
    if (saved) router.push(`/posts/${article.id}/preview`);
  }

  async function publish() {
    const published = await save("publish");
    if (published) router.push(`/posts/${article.id}`);
  }

  async function deleteArticle() {
    if (deletingRef.current) return;
    if (!window.confirm("确定删除这篇文章吗？")) return;
    deletingRef.current = true;
    setIsDeleting(true);

    try {
      await waitForImageUpload();
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok) throw new Error("删除失败，请重试");
      router.push("/");
    } catch (error) {
      deletingRef.current = false;
      setIsDeleting(false);
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "删除失败，请重试");
    }
  }

  return (
    <main className="composer-page">
      <div className="composer-topbar">
        <Link href="/" className="icon-button" aria-label="返回文章列表" title="返回文章列表">
          <ChevronLeft />
        </Link>
        <SaveIndicator state={saveState} message={saveMessage} />
        <div className="composer-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={isUploading || isDeleting}
            onClick={() => void preview()}
          >
            <Eye />预览
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={isUploading || isDeleting}
            onClick={() => void save("draft")}
          >
            <Save />保存
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={isUploading || isDeleting}
            onClick={() => void publish()}
          >
            <Send />发布
          </button>
        </div>
      </div>

      <div className="composer-layout">
        <section className="composer-main" aria-label="文章编辑区">
          <input
            className="title-input"
            value={draft.title}
            maxLength={120}
            placeholder="文章标题"
            aria-label="文章标题"
            onChange={(event) => updateDraft({ title: event.target.value })}
          />
          <RichTextEditor
            articleId={article.id}
            content={draft.content}
            coverAssetId={draft.coverAssetId}
            acquireUploadLock={acquireImageUploadLock}
            releaseUploadLock={releaseImageUploadLock}
            onChange={(content) => updateDraft({ content })}
          />
        </section>

        <aside className="composer-sidebar" aria-label="文章设置">
          <section className="settings-section">
            <div className="settings-heading">
              <h2>文章封面</h2>
              {draft.coverUrl && (
                <button
                  type="button"
                  className="icon-button subtle-icon"
                  aria-label="移除封面"
                  title="移除封面"
                  onClick={() => updateDraft({ coverAssetId: null, coverUrl: null })}
                >
                  <X />
                </button>
              )}
            </div>
            <button
              type="button"
              className="cover-picker"
              onClick={() => fileInputRef.current?.click()}
            >
              {draft.coverUrl ? (
                // User-generated object-storage URLs are validated by the server.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.coverUrl} alt="文章封面" />
              ) : (
                <ImagePlus aria-hidden="true" />
              )}
              {coverProgress !== null && (
                <span className="cover-progress"><progress max={100} value={coverProgress} /></span>
              )}
            </button>
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              aria-label="选择封面图片"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void uploadCover(file);
              }}
            />
            {coverError && <p className="field-error" role="alert">{coverError}</p>}
          </section>

          <section className="settings-section">
            <label className="field-label" htmlFor="article-summary">摘要</label>
            <textarea
              id="article-summary"
              value={draft.summary}
              maxLength={300}
              rows={5}
              onChange={(event) => updateDraft({ summary: event.target.value })}
            />
            <span className="field-count">{draft.summary.length}/300</span>
          </section>

          <section className="settings-section">
            <label className="field-label" htmlFor="article-tags">标签</label>
            <input
              id="article-tags"
              value={draft.tagsText}
              placeholder="Next.js, Tiptap"
              onChange={(event) => updateDraft({ tagsText: event.target.value })}
            />
          </section>

          <section className="settings-section danger-section">
            <button
              type="button"
              className="danger-button"
              disabled={isUploading || isDeleting}
              onClick={() => void deleteArticle()}
            >
              <Trash2 />删除文章
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}

function SaveIndicator({ state, message }: { state: SaveState; message: string }) {
  return (
    <span className={`save-indicator save-${state}`} role="status">
      {state === "saving" ? <LoaderCircle className="spin" /> : state === "saved" ? <Check /> : null}
      {message}
    </span>
  );
}
