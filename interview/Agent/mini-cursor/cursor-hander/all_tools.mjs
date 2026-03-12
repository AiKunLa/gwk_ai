import { tool } from '@langchain/core/tools'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { z } from 'zod'
import fs from 'node:fs/promises'

const readFileTool = tool(
    async ({ filePath }) => {
        console.log(`[工具调用] read_file("${filePath}") `)
        try {
            const content = await fs.readFile(filePath, 'utf-8')
            console.log(`读取成功：${content.length}`)
            return `文件内容： \n${content}`
        } catch (error) {
            console.log(`工具调用read_file("${filePath}") 失败：${error.message}`)
            return `错误：${error.message}`
        }
    },
    {
        name: 'read_file',
        description: "读取指定路径的文件内容",
        schema: z.object({
            filePath: z.string().describe('文件路径')
        })
    }
)

// 写入文件工具
const writeFileTool = tool(
    async ({ filePath, content }) => {
        console.log(`[工具调用] write_file("${filePath}")`)
        try {
            // 提取文件路径的目录路径
            const dir = path.dirname(filePath)
            // 异步创建目录，如果父目录不存在，recursive 表示递归 则递归创建整个目录路径
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(filePath, content, 'utf-8')
            console.log(`[工具调用] write_file("${dir}") 成功写入${content}`)
            return `写入成功：${filePath}`
        } catch (error) {
            console.log(`工具调用 write(${filePath}) 失败：${error.message}`)
            return `写入文件失败: ${filePath}`
        }
    },
    {
        name: "write_file",
        description: "",
        schema: z.object({
            filePath: z.string().describe('文件路径'),
            content: z.string().describe('要写入的文件内容')
        })
    }
)


const executeCommanTool = tool(
    // 传入命令和工作目录，
    async ({ command, workingDirectory }) => {
        // 如果未指定 workingDirectory，则使用当前进程的工作目录（process.cwd()）作为默认目录
        const cwd = workingDirectory || process.cwd()
        console.log(`[工具调用] execute_command("${command}") 在目录 ${cwd} 执行命令`)

        return new Promise((resolve, reject) => {
            const [cmd, ...args] = command.split(' ')

            // 创建一个进程去执行命令，输入输出显示在主进程中

            const child = spawn(cmd, args, {
                cwd,  // 指定子进程的工作目录
                stdio: 'inherit',
                shell: true
            })

            child.on('error', (error) => {
                console.log(`[工具调用] execute_command("${command}") 执行出错：${error.message}`)
                reject(error)
            })

            child.on('close', (code) => {
                if (code === 0) {
                    console.log(`[工具调用] excute_command(${command}) 成功，子进程退出`)

                    // 如果命令执行成功，并且指定了 workingDirectory，提示用户后续命令需要在这个目录下执行
                    const cwdInfo = workingDirectory ? `
                    \n\n重要提示 在指定目录 ${workingDirectory}中执行成功。
                    如果需要在这个目录下执行后续命令，请在调用工具时指定 workingDirectory${workingDirectory} 参数
                    ，不要使用cd命令切换目录
                    ` : ''
                    resolve(`命令执行成功${command} ${cwdInfo}`)
                } else {
                    resolve(`命令执行失败，退出码: ${code}`)
                }
            })
        })
    },
    {
        name: 'execute_command',
        description: "在指定目录执行命令，执行成功后会退出进程",
        schema: z.object({
            command: z.string().describe('要执行的命令'),
            // 工作目录是可选的，如果不指定，则默认为当前目录 optional() 表示可选项 describe() 用于描述字段的含义
            workingDirectory: z.string().optional().describe('命令执行的工作目录，默认为当前目录')
        })
    }
)


const listDirectoryTool = tool(
    async ({ directoryPath }) => {
        try {
            // 这里文件路径可能不存在，会报错
            const files = await fs.readdir(directoryPath)
            console.log(`[工具调用] list_directory(${directoryPath}) 成功列出 ${files.length} 个文件`)
            // 对每一项进行添加格式化字符串，并换行拼接
            return `目录内容: \n ${files.map(f => `- ${f}`).join('\n')}`
        } catch (error) {
            console.log(`[工具调用] list_directory(${directoryPath}) 失败 ${error.message} 个文件`)
            return `列出目录失败： ${error.message}`
        }
    },
    {
        name: 'list_directory',
        description: '列出指定目录下所有文件和文件夹',
        schema: z.object({
            directoryPath: z.string().describe('目录路径')
        })
    }
)

export {
    readFileTool, writeFileTool, executeCommanTool, listDirectoryTool
}
