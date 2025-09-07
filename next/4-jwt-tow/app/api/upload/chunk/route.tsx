import { NextRequest,NextResponse } from "next/server";
import {saveChunk,readMeta,writeMeta,listUploadedChunks} from '@/lib/upload-server'

export async function PUT(request:NextRequest) {
    // 头先到达
    const fileHash = request.headers.get("x-file-hash")
    const chunkIndex = Number(request.headers.get("x-chunk-index"))

    console.log("fileHash",fileHash)
    console.log("chunkIndex",chunkIndex)

    if(!fileHash || Number.isNaN(chunkIndex)){
        return NextResponse.json({
            error:'缺少文件hash或分片索引'
        },{status:400})
    }

    // 数据全部到达之后 将请全体中的ArrayBuffer转为 node中的buffer对象，以便于处理二进制数据或字符串内容
    const buf = Buffer.from(await request.arrayBuffer())
    // 保存到
    await saveChunk(fileHash,chunkIndex, buf); 

    // 读取信息
    const meta = readMeta(fileHash)
    if(meta) {
        // 使用空值运算符  使用Set来实现大文件切片上传索引不重复
        const set = new Set([...(meta.uploadedChunks ?? []),chunkIndex])
        meta.uploadedChunks = Array.from(set).sort((a,b)=>a-b)
        writeMeta(fileHash,meta)
    }

    return NextResponse.json({
        ok:true,
        uploaded:listUploadedChunks(fileHash) // 已经上传完毕的分片
    })
    
}