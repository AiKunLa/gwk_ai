'use client'
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import {
  type HashWorkerOut,
  type HashWorkerIn
} from '@/app/hash.worker'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_CONCURRENCY = 4 // 最大并发数量

type InitResp = {
    complete:boolean
    uploaded:number[] // 存储已经上传的分片索引
}

export default function Upload(){
    // Web Worker 实例的引用，用于在后台处理大文件哈希计算
    const workerRef = useRef<Worker | null>(null)

    // 文件的哈希值，用于文件校验和断点续传
    const [hash,setHash] = useState<string>("")

    // 当前选择的待上传文件
    const [file,setFile] = useState<File | null>(null)

    // 当前上传状态的文本描述，如"计算哈希中..."、"上传中..."等
    const [status,setStatus] = useState<string>("")

    // 根据文件大小和分片大小计算的总分片数量，仅在file变化时重新计算
    const totalChunks = useMemo(() => file ? Math.ceil(file.size / CHUNK_SIZE) : 0 , [file])

    // 用于中断文件分片处理的控制器引用
    const abortRef = useRef<AbortController|null>(null) // 

    // 用于控制文件处理是否暂停的状态引用
    const pausedRef = useRef<boolean>(false) //
    const [progress,setProgress] = useState<number>(0)
    // 在组件挂载时，创建线程，卸载时删除
    useEffect(()=>{
        const worker = new Worker(new URL("../hash.worker.ts", 
      import.meta.url))
        workerRef.current = worker

        worker.onmessage = (e:MessageEvent<HashWorkerOut>) => {
            const msg = e.data
            if(msg.type === "PROGRESS"){
                setStatus(`计算中${(msg.process * 100).toFixed(2)}%`)
            }
            if(msg.type === 'DONE'){
                setHash(msg.hash)
            }

        }

        return () => {
            workerRef.current?.terminate()
            workerRef.current = null
        }
    },[])

    // 只做第一次
    const handleFile = useCallback(async (file:File)=>{
        setFile(file)
        setStatus('计算哈希中...')
        workerRef.current?.postMessage({ // 这里由于postMessage不知道该传什么数据类型
            type:'HASH',
            file,
            chunkSize:CHUNK_SIZE // 切片数量
        } as HashWorkerIn)
    },[])

    // 触发文件上传
    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file){
            handleFile(file)
        }
    }


    // 获取后端已经上传的文件信息
    const initUpload = async ():Promise<InitResp> => {
        const res = await fetch('/api/upload/init',{
            method:"POST",
            headers: {
                'Content-Type':"application/json"
            },
            body: JSON.stringify({
                fileHash:hash,
                fileName:file!.name, //由于ts可能会推断变量为空 !表示一定存在，防止编译报错
                fileSize:file!.size,
                chunkSize:CHUNK_SIZE,
                totalChunks
            })
        })
        return res.json() as Promise<InitResp>
    }

    // 实际的分片上传
    const uploadChunk = async (index:number,signal:AbortSignal) => {
        const start = index * CHUNK_SIZE
        const end = Math.min(file!.size,start+CHUNK_SIZE)
        const blob = file!.slice(start,end)

        const res = await fetch('/api/upload/chunk',{
            method:"PUT", // 直接替换片段，因为片段无法修改
            headers:{
                'x-file-hash':hash,
                "x-chunk-index":String(index)
            },
            body:blob,
            signal // 可停止请求
        })

        if(!res.ok) throw new Error(`分片${index}上传失败`)
        return res.json()
    }

    // 合并 将要合并的文件hash发送给后端
    const mergeAll = async () => {
        const res = await fetch("/api/upload/merge",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                fileHash:hash
            })
        })
        return res.json()
    }

    // 点击上传
    const startUpload = async () => {
        if(!file) return
        setStatus('初始化上传...')
        // AbortController 用一定的开销，不应该在组件挂载的时候创建
        abortRef.current = new AbortController()
        pausedRef.current = false

        // 获取后端已经上传的文件信息
        const init = await initUpload();

        // const init = {
        //     complete:false,
        //     uploaded:[]
        // }

        // 若已经上传成功了
        if(init.complete){
            setProgress(100)
            setStatus("妙传完成")
            return
        }

        // 已经上传的
        // 进行文件上传  使用set存储不可重复的切片index存储
        const uploaded = new Set<number>(init.uploaded ?? []) // 空值运算符 若init.uploaded为空，则用[] 否则用init.uploaded
        let done = uploaded.size // set的长度
        setProgress(Math.floor((done/totalChunks) * 100)) // 更新进度

        // 并发限流 使用队列
        const queue:number[] = []
        for(let i =0;i<totalChunks;i++){
            // 将uploaded中没有上传的分片索引放入队列中
            if(!uploaded.has(i)){
                queue.push(i)
            }
        }

        // upload worker 存储所有上传任务的Promise数组
        const workers:Promise<void>[] = []

        //采用递归方式从队列中获取并处理上传任务：
        const next = async () => {
            // 检查是否暂停上传
            if(pausedRef.current) return 
            const idx = queue.shift()
            // 如果队列为空，终止递归
            if(idx === undefined) return
            try {
                // 实际上传 上传单个分片，传入可中断信号
                await uploadChunk(idx,abortRef.current!.signal)
                done++
                // 更新上传进度
                setProgress(Math.floor((done/totalChunks)*100))
            } catch (error) {
                
            }finally {
                // 队列还有任务时，继续处理下一个
                if(queue.length) await next()
            }
        }
        // 根据最大并发数和队列长度创建初始任务
        // 计算实际需要启动的初始并发任务数，确保并发数不超过MAX_CONCURRENCY设置的值
        // 确保worker（池）中只有限定数量的next（可以将他称作为干活的），而这些next在上传完当前分片之后，会继续去队列中上传下一个分片。
        for(let c = 0;c < Math.min(MAX_CONCURRENCY,queue.length);c++){
            workers.push(next())
        }

        setStatus('分片上传中...')
        try {
            // 一个错就就中断
            await Promise.all(workers)
            if(pausedRef.current) {
                setStatus("已暂停")
                return
            }
            setStatus('合并分片..') 
            const r = await mergeAll()
            setStatus(r?.ok?"上传完成":"合并失败")
        } catch (error:any) {
            if(error?.name === "AbortError"){
                setStatus('已经暂停')
            }else {
                console.log(error)
                setStatus(error?.message || "上传错误")
            }
        }
    }

    // 暂停上传
    const pause = () => {
        pausedRef.current = true
        abortRef.current?.abort();
    }

    // 继续上传
    const resume = async () => {
        if(!file || !hash) return
        setStatus('继续上传...')
        await startUpload();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold">大文件上传</h1> 
                <label className="block">
                <span className="text-sm text-gray-600">选择文件</span>
                <input 
                    type="file" 
                    className="mt-2 block w-full cursor-pointer rounded-lg border p-2"
                    onChange={onFileChange}
                />  
                </label> 
                {
                    file && (
                        <div className="rounded-xl border bg-white p-4 shadow">
                            <div className="text-sm text-gray-700">
                                文件：{file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                            </div>
                            <div className="text-sm text-gray-700">
                                分片大小：{CHUNK_SIZE / (1024 * 1024)}MB
                                分片总数：{totalChunks}
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded bg-gray-200">
                                <div className="h-3 bg-black" style={{width:`${progress}%`}}></div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">{status}</div>
                            <div className="mt-4 flex gap-2">
                                <button className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                                disabled={!file}
                                onClick={startUpload}
                                >
                                开始上传
                                </button>
                                <button className="rounded-xl border px-4 py-2"
                                    onClick={pause}
                                >
                                    暂停上传
                                </button>
                                <button className="rounded-xl border px-4 py-2"
                                    onClick={resume}
                                >
                                    继续上传
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </main>
    )
}