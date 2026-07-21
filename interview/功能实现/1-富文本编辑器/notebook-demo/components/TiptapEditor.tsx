

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
export function TiptapEditor() {
    // 1. 创建编辑器实例
    const editor = useEditor({
        // 2. 配置编辑器
        extensions: [StarterKit],
        // 3. 设置初始内容
        content: '<p>Hello World! 🌎️</p>',
    })

    // 4. 渲染编辑器内容
    return (
        <div className="border border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white">
            
        </div>
    )
}