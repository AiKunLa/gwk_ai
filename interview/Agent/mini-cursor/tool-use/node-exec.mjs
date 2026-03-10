// exec 执行命令tool
// node 内置模块 可以创建一个子进程
// 进程是操作系统分配资源的最小单位，线程是执行的最小单位
import { spawn } from 'node:child_process'

//组进程 node-exec.mjs
// 主进程
// cmd执行本身就是进程，他不能阻塞进程

// 父进程负责与用户的交互

const command = 'dir /od'

// 将命令字符串拆分为命令名和参数数组
// 例如: "ls -la" -> ["ls", "-la"] -> cmd="ls", args=["-la"]
const [cmd, ...args] = command.split(' ');

// 使用 spawn 创建子进程执行命令
/**
 * 
 * 使用子进程的主要原因是为了不阻塞主 Node.js 进程，
 * Node.js 是单线程、事件驱动的，所有代码都在主线程执行。如果直接执行命令（如用 execSync 同步方式），会阻塞整个进程，导致：
 * 无法响应其他请求 - 主线程被命令卡住，无法处理其他任务
    界面冻结 - 如果有 UI，用户体验会很差
    无法实现并发 - 一次只能执行一个命令
 * 
 */

// - cmd: 要执行的命令名
// - args: 命令参数数组
// - options: 配置选项
//   - cmd: 传递给子进程的命令（用于调试/日志）
//   - stdio: 'inherit' 表示子进程继承父进程的 stdio（子进程的输出直接显示在终端）
//   - shell: true 表示在 shell 中执行命令（支持管道、重定向等 shell 特性）


const cwd = process.cwd()
console.log(`current dir: ${cwd}`)

const child = spawn(cmd, args, {
    cmd,
    stdio: 'inherit', //让子进程的输入输出直接使用父进程的终端。
    shell: true
})

let errorMsg = ''
child.on('error', (error) => {
    errorMsg = error.message
})

child.on('close', (code) => {
    if (code === 0) {
        process.exit(0)
    } else {
        if (errorMsg) {
            console.error(`errot:${errorMsg}`)
        }
        process.exit(code || 1)
    }
})