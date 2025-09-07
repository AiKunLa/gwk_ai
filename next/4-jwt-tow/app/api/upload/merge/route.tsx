import { ensureUploadDirs, readMeta ,mergeChunks, writeMeta} from "@/lib/upload-server";
import { NextRequest,NextResponse } from "next/server";

/**
 * 
 * @param request 文件合并
 */
export async function POST(request:NextRequest){
    const {fileHash} = await request.json()
    ensureUploadDirs(fileHash)

    const meta = readMeta(fileHash)
    if(!meta) {
        return NextResponse.json({
            error:"找不到meta"
        },{status:404})
    }
    const {fileName,totalChunks} = meta
    const finalPath = await mergeChunks(fileHash,fileName,totalChunks)

    // writeStream 是一个可写流 Write Stream 继承自EventEmitter，这个EventEmitter是事件，所以writeStream可以进行事件监听
    meta.complete = true
    meta.finalPath = finalPath as string
    writeMeta(fileHash,meta)
    return NextResponse.json({
        ok:true,
        finalPath
    })

}