"use client"
import ReactMarkdown from 'react-markdown'

// 导入 ai 包中的 Message 类型
import type { Message } from "ai"

interface ChatOutputProps {
    messages:Message[]
    status:string
}

export default function ChatOutput({
    messages,
    status
}:ChatOutputProps) {
    return (
        <>
            {
                messages.map((message,index)=> (
                    message.role === "user" ? (
                        <UserChat key={index} content={message.content} />
                    ): (
                        <AssistantChat key={index} content={message.content} />
                    )
                ))
            }
            {
                status === "submitted" && (
                    <div className='text-muted-foreground'>正在生成中...</div>
                )
            }
            {
                status === 'error' && (
                    <div className='text-red-500'>生成失败</div>
                )
            }
        </>
    )
}

const UserChat = ({content}: {content:string}) => {
    return (
        <div className='bg-muted p-2 rounded-2xl ml-auto max-w-[80%] w-fit py-2 mb-6'>
            {content}
        </div>
    )
}

const AssistantChat = ({content}: {content : string}) => {
    return (
        <div className='pr-8 w-full mb-6'>
            <ReactMarkdown
                components={{
                    a:({href,children}) => (
                        <a target='_blank' href={href}>{children}</a>
                    )
                }}
            >{content}</ReactMarkdown>
        </div>
    )
}