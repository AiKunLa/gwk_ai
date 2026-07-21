"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code2,
  FileCode2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
  onChooseImage: () => void;
}

export function EditorToolbar({ editor, onChooseImage }: EditorToolbarProps) {
  const blockStyle = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  function setLink() {
    const currentHref = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("链接地址", currentHref ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="富文本工具栏">
      <select
        className="toolbar-select"
        aria-label="文本样式"
        value={blockStyle}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 })
              .run();
          }
        }}
      >
        <option value="paragraph">正文</option>
        <option value="h1">一级标题</option>
        <option value="h2">二级标题</option>
        <option value="h3">三级标题</option>
      </select>

      <ToolbarDivider />
      <ToolbarButton
        label="粗体"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold />}
      />
      <ToolbarButton
        label="斜体"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic />}
      />
      <ToolbarButton
        label="删除线"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough />}
      />
      <ToolbarButton
        label="行内代码"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Code2 />}
      />

      <ToolbarDivider />
      <ToolbarButton
        label="引用"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote />}
      />
      <ToolbarButton
        label="无序列表"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={<List />}
      />
      <ToolbarButton
        label="有序列表"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered />}
      />
      <ToolbarButton
        label="代码块"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={<FileCode2 />}
      />
      <ToolbarButton
        label="分割线"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<Minus />}
      />
      <ToolbarButton
        label="链接"
        active={editor.isActive("link")}
        onClick={setLink}
        icon={<Link2 />}
      />
      <ToolbarButton label="插入图片" onClick={onChooseImage} icon={<ImagePlus />} />

      <span className="toolbar-spacer" />
      <ToolbarButton
        label="撤销"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
        icon={<Undo2 />}
      />
      <ToolbarButton
        label="重做"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
        icon={<Redo2 />}
      />
    </div>
  );
}

function ToolbarButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="toolbar-button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="toolbar-divider" aria-hidden="true" />;
}
