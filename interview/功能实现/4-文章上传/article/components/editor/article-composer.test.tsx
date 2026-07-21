import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ArticleComposer } from "@/components/editor/article-composer";
import {
  EMPTY_TIPTAP_DOCUMENT,
  type TiptapDocument,
} from "@/lib/domain/article-content";
import type { ArticleView } from "@/lib/server/services/article-service";

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));
const richTextEditorRender = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/components/editor/rich-text-editor", () => ({
  RichTextEditor: (props: unknown) => {
    richTextEditorRender(props);
    return <div data-testid="rich-text-editor" />;
  },
}));

interface EditorHarnessProps {
  acquireUploadLock: () => boolean;
  releaseUploadLock: () => void;
  onChange: (content: TiptapDocument) => void;
}

describe("ArticleComposer", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    richTextEditorRender.mockClear();
    routerMock.push.mockReset();
    routerMock.refresh.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps saving edits made during a queued preview request", async () => {
    const user = userEvent.setup();
    const article = createArticle();
    const firstSave = Promise.withResolvers<Response>();
    const secondSave = Promise.withResolvers<Response>();
    fetchMock
      .mockReturnValueOnce(firstSave.promise)
      .mockReturnValueOnce(secondSave.promise)
      .mockResolvedValueOnce(createSaveResponse(article, 3));

    render(<ArticleComposer article={article} />);

    await user.clear(screen.getByLabelText("摘要"));
    await user.type(screen.getByLabelText("摘要"), "first snapshot");
    await user.click(screen.getByRole("button", { name: "保存" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: "预览" }));
    await user.clear(screen.getByLabelText("摘要"));
    await user.type(screen.getByLabelText("摘要"), "queued snapshot");
    firstSave.resolve(createSaveResponse(article, 1));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    await user.clear(screen.getByLabelText("摘要"));
    await user.type(screen.getByLabelText("摘要"), "latest snapshot");
    secondSave.resolve(createSaveResponse(article, 2));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith(`/posts/${article.id}/preview`),
    );
    expect(readRequestBody(fetchMock, 2)).toMatchObject({
      action: "draft",
      summary: "latest snapshot",
    });
  });

  it("waits for an upload that starts while preview is saving", async () => {
    const user = userEvent.setup();
    const article = createArticle();
    const firstSave = Promise.withResolvers<Response>();
    fetchMock
      .mockReturnValueOnce(firstSave.promise)
      .mockResolvedValueOnce(createSaveResponse(article, 2));

    render(<ArticleComposer article={article} />);
    await user.type(screen.getByLabelText("文章标题"), " updated");
    await user.click(screen.getByRole("button", { name: "预览" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const editorProps = getEditorProps();
    act(() => {
      expect(editorProps.acquireUploadLock()).toBe(true);
    });
    expect(screen.getByRole("button", { name: "预览" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "发布" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "删除文章" })).toBeDisabled();

    firstSave.resolve(createSaveResponse(article, 1));
    await waitFor(() => expect(routerMock.refresh).toHaveBeenCalledTimes(1));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(routerMock.push).not.toHaveBeenCalled();

    const uploadedContent: TiptapDocument = {
      type: "doc",
      content: [
        {
          type: "articleImage",
          attrs: {
            assetId: "asset-uploaded",
            src: "https://cdn.example.test/asset-uploaded.png",
          },
        },
      ],
    };
    act(() => {
      editorProps.onChange(uploadedContent);
      editorProps.releaseUploadLock();
    });

    expect(screen.getByRole("button", { name: "删除文章" })).toBeEnabled();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith(`/posts/${article.id}/preview`),
    );
    expect(readRequestBody(fetchMock, 1)).toMatchObject({
      content: uploadedContent,
    });
  });

  it("does not send a draft PATCH for clean save or preview actions", async () => {
    const user = userEvent.setup();
    const article = createArticle({ status: "published", publishedAt: 1_700_000_000_000 });
    fetchMock.mockResolvedValue(createSaveResponse(article, 1));

    render(<ArticleComposer article={article} />);
    await user.click(screen.getByRole("button", { name: "保存" }));
    await user.click(screen.getByRole("button", { name: "预览" }));

    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith(`/posts/${article.id}/preview`),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function getEditorProps(): EditorHarnessProps {
  const props = richTextEditorRender.mock.lastCall?.[0] as
    | EditorHarnessProps
    | undefined;
  if (!props) throw new Error("RichTextEditor was not rendered");
  return props;
}

function createArticle(overrides: Partial<ArticleView> = {}): ArticleView {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Existing title",
    summary: "Existing summary",
    content: EMPTY_TIPTAP_DOCUMENT,
    contentText: "",
    tags: [],
    status: "draft",
    revision: 0,
    coverAssetId: null,
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
    publishedAt: null,
    effectiveCoverAssetId: null,
    effectiveCoverUrl: null,
    ...overrides,
  };
}

function createSaveResponse(article: ArticleView, revision: number): Response {
  return {
    ok: true,
    json: async () => ({
      success: true,
      data: { ...article, revision },
    }),
  } as Response;
}

function readRequestBody(fetchMock: ReturnType<typeof vi.fn>, index: number) {
  const body = fetchMock.mock.calls[index]?.[1]?.body;
  if (typeof body !== "string") throw new Error("Expected a JSON request body");
  return JSON.parse(body) as unknown;
}
