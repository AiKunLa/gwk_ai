import { ensureUploadDirs,fileAlreadyExist, listUploadedChunks, readMeta, writeMeta } from "@/lib/upload-server";
import { NextRequest,NextResponse } from "next/server";

// 获取上传文件信息
export async function POST(request:NextRequest) {
    const {fileHash,fileName,fileSize,chunkSize,totalChunks} = await request.json()
    ensureUploadDirs(fileHash)
    if(fileAlreadyExist(fileHash,fileName)){
        return NextResponse.json({
            complete:true,
            uploaded:[],
            message:"妙传:file already exist"
        })
    }

    // 断点续传,读取mate.json文件返回给前端
    const existed = readMeta(fileHash)

    const uploaded = listUploadedChunks(fileHash)
    const meta = {
        fileName,fileSize,chunkSize,totalChunks,
        uploadedChunks:uploaded,complete:false
    }

    // 初始化meta文件，用于存储文件上传的信息
    writeMeta(fileHash,{...(existed || {}),...meta})

    return NextResponse.json({
        complete:false,
        uploaded,
        message:"初始化成功"
    })

}