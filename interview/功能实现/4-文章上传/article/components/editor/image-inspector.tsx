"use client";

import type { Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";

export function ImageInspector({ editor }: { editor: Editor }) {
  if (!editor.isActive("articleImage")) return null;
  const attributes = editor.getAttributes("articleImage") as {
    alt?: string;
    caption?: string;
    align?: "left" | "center" | "right";
    size?: "small" | "medium" | "wide";
  };

  return (
    <div className="image-inspector" aria-label="图片设置">
      <label>
        <span>替代文本</span>
        <input
          value={attributes.alt ?? ""}
          maxLength={200}
          onChange={(event) =>
            editor.chain().focus().updateAttributes("articleImage", { alt: event.target.value }).run()
          }
        />
      </label>
      <label>
        <span>图片说明</span>
        <input
          value={attributes.caption ?? ""}
          maxLength={300}
          onChange={(event) =>
            editor
              .chain()
              .focus()
              .updateAttributes("articleImage", { caption: event.target.value })
              .run()
          }
        />
      </label>
      <div className="image-inspector-group" aria-label="图片对齐">
        {([
          ["left", "左对齐", <AlignLeft key="left" />],
          ["center", "居中", <AlignCenter key="center" />],
          ["right", "右对齐", <AlignRight key="right" />],
        ] as const).map(([align, label, icon]) => (
          <button
            type="button"
            key={align}
            aria-label={label}
            title={label}
            aria-pressed={(attributes.align ?? "center") === align}
            onClick={() =>
              editor.chain().focus().updateAttributes("articleImage", { align }).run()
            }
          >
            {icon}
          </button>
        ))}
      </div>
      <label className="image-size-field">
        <span>尺寸</span>
        <select
          value={attributes.size ?? "wide"}
          onChange={(event) =>
            editor
              .chain()
              .focus()
              .updateAttributes("articleImage", { size: event.target.value })
              .run()
          }
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="wide">通栏</option>
        </select>
      </label>
      <button
        type="button"
        className="danger-icon-button"
        aria-label="删除图片"
        title="删除图片"
        onClick={() => editor.chain().focus().deleteSelection().run()}
      >
        <Trash2 />
      </button>
    </div>
  );
}
