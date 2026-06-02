'use client' // Next.js App Router 必须，标记此组件仅在客户端运行

// ========================
// 1. 导入 Tiptap 核心和扩展
// ========================
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'        // 包含标题、加粗、斜体、列表、引用等基础扩展
// import Underline from '@tiptap/extension-underline'   // 下划线
// import Link from '@tiptap/extension-link'            // 链接
// import Image from '@tiptap/extension-image'           // 图片
// import TextStyle from '@tiptap/extension-text-style'  // 文字样式基类（Color 扩展依赖它）
// import Color from '@tiptap/extension-color'            // 文字颜色
// import Highlight from '@tiptap/extension-highlight'    // 高亮
// import TaskList from '@tiptap/extension-task-list'     // 任务列表
// import TaskItem from '@tiptap/extension-task-item'     // 任务项

// Tiptap 扩展（全部改为命名导入）
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'          // StarterKit 本身是默认导出，保持不变
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'



// ========================
// 2. 导入图标库 (lucide-react)
// ========================
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  List, ListOrdered, Quote, Undo2, Redo2, Link2, ImageIcon,
  Highlighter, Palette, Heading1, Heading2, Heading3, Minus
} from 'lucide-react'
import { useCallback, useState } from 'react'

// ============================================================
// 3. 可复用的工具栏按钮组件
//    接收 onClick 点击处理、isActive 激活状态、icon 图标、title 提示文字
//    激活时高亮为蓝底蓝字，否则灰色
// ============================================================
const ToolbarButton = ({ onClick, isActive, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
    }`}
  >
    {icon}
  </button>
)

// 工具栏分隔线
const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />

// ============================================================
// 4. 主编辑器组件
// ============================================================
export default function RichTextEditor() {
  const [linkUrl, setLinkUrl] = useState('')

  // ----------------------------------------------------------
  // 4.1 创建编辑器实例
  //     - extensions: 需要的功能扩展列表
  //     - content: 初始内容，支持 HTML 或 JSON
  //     - editorProps: 注入全局属性，这里用 Tailwind Typography 美化排版
  // ----------------------------------------------------------
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }, // 只开启 H1-H3，避免过多层级
      }),
      Underline,
      Link.configure({ openOnClick: false }), // 不允许点击直接跳转，方便编辑
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' }, // 图片自适应，避免宽高比警告
        allowBase64: true, // 允许粘贴 base64 图片
      }),
      TextStyle,  // 必须加载，Color 依赖它
      Color,       // 文字颜色
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }), // 允许任务列表嵌套
    ],
    content: '<p>✨ 在这里开始你的创作…</p>',
    editorProps: {
      attributes: {
        // Tailwind Typography 排版类，需要安装 @tailwindcss/typography 插件
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none',
      },
    },
  })

  // ----------------------------------------------------------
  // 4.2 工具栏功能函数
  // ----------------------------------------------------------

  // 插入图片（演示用弹窗输入 URL，实际项目可替换为文件上传）
  const addImage = useCallback(() => {
    const url = window.prompt('请输入图片链接')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run() // 链式调用：聚焦 → 插入图片 → 执行
    }
  }, [editor])

  // 设置超链接（如果有选中文案则转为链接，如果已存在链接则取消）
  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href // 获取当前选中区域的链接属性
    const url = window.prompt('请输入链接地址', previousUrl)
    if (url === null) return // 用户取消
    if (url === '') {
      // 如果输入空字符串，移除链接
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      // 否则设置或更新链接
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  // 编辑器未初始化时不渲染任何内容
  if (!editor) return null

  // ----------------------------------------------------------
  // 4.3 渲染编辑器和工具栏
  // ----------------------------------------------------------
  return (
    <div className="border border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white">
      {/* 工具栏区域 */}
      <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50/80">
        {/* 撤销/重做 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon={<Undo2 size={18} />}
          title="撤销"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon={<Redo2 size={18} />}
          title="重做"
        />
        <Divider />

        {/* 标题 H1/H2/H3，动态判断当前激活的标题级别 */}
        {[1, 2, 3].map(level => (
          <ToolbarButton
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            isActive={editor.isActive('heading', { level })}
            icon={level === 1 ? <Heading1 size={18} /> : level === 2 ? <Heading2 size={18} /> : <Heading3 size={18} />}
            title={`标题 ${level}`}
          />
        ))}
        <Divider />

        {/* 文本样式按钮 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold size={18} />}
          title="加粗"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic size={18} />}
          title="斜体"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<UnderlineIcon size={18} />}
          title="下划线"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough size={18} />}
          title="删除线"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<Code size={18} />}
          title="行内代码"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          icon={<Highlighter size={18} />}
          title="高亮"
        />
        <Divider />

        {/* 列表：无序列表、有序列表、任务列表 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List size={18} />}
          title="无序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered size={18} />}
          title="有序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={<List size={18} />}
          title="任务列表"
        />
        <Divider />

        {/* 块级元素：引用、分割线 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote size={18} />}
          title="引用"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          icon={<Minus size={18} />}
          title="分割线"
        />
        <Divider />

        {/* 链接和图片插入 */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          icon={<Link2 size={18} />}
          title="插入链接"
        />
        <ToolbarButton
          onClick={addImage}
          isActive={false}
          icon={<ImageIcon size={18} />}
          title="插入图片"
        />

        {/* 文字颜色选择器（悬停下拉） */}
        <div className="relative group">
          <button className="p-2 rounded hover:bg-gray-100 text-gray-700">
            <Palette size={18} />
          </button>
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-lg shadow-lg hidden group-hover:flex gap-1 z-10">
            {['#000000', '#e60000', '#ff9900', '#008a00', '#0066cc', '#9933ff'].map(color => (
              <button
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="px-6 py-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}