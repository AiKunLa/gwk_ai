import { DomainError } from "@/lib/domain/errors";

export interface TiptapMark {
  readonly type: string;
  readonly attrs?: Readonly<Record<string, unknown>>;
}

export interface TiptapNode {
  readonly type: string;
  readonly text?: string;
  readonly attrs?: Readonly<Record<string, unknown>>;
  readonly marks?: readonly TiptapMark[];
  readonly content?: readonly TiptapNode[];
}

export interface TiptapDocument extends TiptapNode {
  readonly type: "doc";
}

export const EMPTY_TIPTAP_DOCUMENT: TiptapDocument = Object.freeze({
  type: "doc",
  content: Object.freeze([{ type: "paragraph" }]),
});

const MAX_DOCUMENT_BYTES = 500_000;
const MAX_DOCUMENT_NODES = 5_000;
const MAX_DOCUMENT_DEPTH = 20;
const allowedNodeTypes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "hardBreak",
  "horizontalRule",
  "articleImage",
]);
const allowedMarkTypes = new Set([
  "bold",
  "italic",
  "strike",
  "code",
  "link",
  "underline",
]);

export function validateTiptapDocument(input: unknown): TiptapDocument {
  let serialized: string;
  try {
    serialized = JSON.stringify(input);
  } catch {
    throw new DomainError("正文格式不合法", "INVALID_CONTENT");
  }

  if (!serialized || Buffer.byteLength(serialized, "utf8") > MAX_DOCUMENT_BYTES) {
    throw new DomainError("正文内容过大", "CONTENT_TOO_LARGE");
  }

  const document = structuredClone(input) as TiptapDocument;
  if (!document || typeof document !== "object" || document.type !== "doc") {
    throw new DomainError("正文必须是 Tiptap 文档", "INVALID_CONTENT");
  }

  let nodeCount = 0;
  const stack: Array<{ node: TiptapNode; depth: number }> = [
    { node: document, depth: 1 },
  ];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;

    nodeCount += 1;
    if (
      nodeCount > MAX_DOCUMENT_NODES ||
      current.depth > MAX_DOCUMENT_DEPTH ||
      !allowedNodeTypes.has(current.node.type)
    ) {
      throw new DomainError("正文结构不合法", "INVALID_CONTENT");
    }

    if (current.node.type === "text" && typeof current.node.text !== "string") {
      throw new DomainError("文本节点不合法", "INVALID_CONTENT");
    }

    assertValidMarks(current.node);

    if (current.node.content !== undefined && !Array.isArray(current.node.content)) {
      throw new DomainError("正文子节点不合法", "INVALID_CONTENT");
    }

    for (const child of current.node.content ?? []) {
      if (!child || typeof child !== "object" || typeof child.type !== "string") {
        throw new DomainError("正文节点不合法", "INVALID_CONTENT");
      }
      stack.push({ node: child, depth: current.depth + 1 });
    }
  }

  return document;
}

function assertValidMarks(node: TiptapNode): void {
  if (node.marks === undefined) return;
  if (node.type !== "text" || !Array.isArray(node.marks)) {
    throw new DomainError("正文标记不合法", "INVALID_CONTENT");
  }

  for (const mark of node.marks) {
    if (
      !mark ||
      typeof mark !== "object" ||
      typeof mark.type !== "string" ||
      !allowedMarkTypes.has(mark.type) ||
      (mark.attrs !== undefined &&
        (!mark.attrs || typeof mark.attrs !== "object" || Array.isArray(mark.attrs))) ||
      (mark.type === "link" && typeof mark.attrs?.href !== "string")
    ) {
      throw new DomainError("正文标记不合法", "INVALID_CONTENT");
    }
  }
}

export function extractImageAssetIds(document: TiptapNode): string[] {
  const assetIds: string[] = [];
  const seenAssetIds = new Set<string>();

  visitNodes(document, (node) => {
    if (node.type !== "articleImage") return;
    const assetId = node.attrs?.assetId;
    if (typeof assetId !== "string" || assetId.length === 0 || seenAssetIds.has(assetId)) {
      return;
    }

    seenAssetIds.add(assetId);
    assetIds.push(assetId);
  });

  return assetIds;
}

export function resolveCoverAssetId(
  explicitCoverAssetId: string | null,
  document: TiptapNode,
): string | null {
  return explicitCoverAssetId ?? extractImageAssetIds(document)[0] ?? null;
}

export function extractPlainText(document: TiptapNode): string {
  const lines: string[] = [];
  const textBlockTypes = new Set(["paragraph", "heading", "codeBlock"]);

  visitNodes(document, (node) => {
    if (!textBlockTypes.has(node.type)) return;
    const text = collectText(node).trim();
    if (text) lines.push(text);
  });

  return lines.join("\n");
}

export function canonicalizeArticleImages(
  document: TiptapDocument,
  publicUrlByAssetId: ReadonlyMap<string, string>,
): TiptapDocument {
  return mapNode(document) as TiptapDocument;

  function mapNode(node: TiptapNode): TiptapNode {
    if (node.type === "articleImage") {
      const assetId = node.attrs?.assetId;
      if (typeof assetId !== "string") {
        throw new DomainError("图片节点缺少资产编号", "INVALID_IMAGE_NODE");
      }

      const src = publicUrlByAssetId.get(assetId);
      if (!src) {
        throw new DomainError("正文引用了不可用的图片", "ASSET_NOT_READY");
      }

      return {
        type: "articleImage",
        attrs: {
          assetId,
          src,
          alt: normalizeOptionalText(node.attrs?.alt, 200),
          caption: normalizeOptionalText(node.attrs?.caption, 300),
          align: normalizeEnum(node.attrs?.align, ["left", "center", "right"], "center"),
          size: normalizeEnum(node.attrs?.size, ["small", "medium", "wide"], "wide"),
        },
      };
    }

    return {
      ...node,
      attrs: node.attrs ? { ...node.attrs } : undefined,
      marks: node.marks?.map((mark) => ({
        ...mark,
        attrs: mark.attrs ? { ...mark.attrs } : undefined,
      })),
      content: node.content?.map(mapNode),
    };
  }
}

function normalizeOptionalText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function collectText(node: TiptapNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(collectText).join("");
}

function visitNodes(node: TiptapNode, visitor: (node: TiptapNode) => void): void {
  visitor(node);
  for (const child of node.content ?? []) {
    visitNodes(child, visitor);
  }
}
