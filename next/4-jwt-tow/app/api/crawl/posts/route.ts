import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import { crawlBky } from '@/lib/crawl'
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    // 数据拼接路径
    const dataPath = path.join(process.cwd(), "data", "posts.json");
    console.log(dataPath)
    // 读取文件数据
    const fileContent = await fs.readFile(dataPath, "utf-8");
    // 转为json格式数据
    const data = JSON.parse(fileContent);
    // 校验数据是否有效
    if (!data.posts || !Array.isArray(data.posts)) {
      return NextResponse.json(
        {
          error: "invalid data format",
        },
        {
          status: 400,
        }
      );
    }
    // 写入数据库
    const posts = data.posts;
    // 用于记录成功插入的数量
    let successCount = 0;
    // 用于记录失败的错误信息
    const errors: string[] = [];

    for (const post of posts) {
      try {
        // 校验每个帖子的数据是否包含必要字段
        if (!post.title || !post.content) {
          errors.push(`Post 缺少必要字段，title: ${post.title || 'undefined'}, content: ${post.content || 'undefined'}`);
          continue;
        }
        await prisma.post.create({
          data: {
            title: post.title,
            content: post.content,
            publish: true,
            authorId: 1,
          },
        });
        successCount++;
      } catch (error) {
        // 捕获单个帖子插入失败的错误
        if (error instanceof Error) {
          errors.push(`插入帖子失败，title: ${post.title || 'undefined'}, 错误信息: ${error.message}`);
        } else {
          errors.push(`插入帖子失败，title: ${post.title || 'undefined'}, 错误信息: 未知错误`);
        }
      }
    }

    if (errors.length > 0) {
      // 如果有失败的情况，返回部分成功的响应
      return NextResponse.json({
        message: `部分帖子导入成功，成功 ${successCount} 条，失败 ${errors.length} 条`,
        successCount,
        errors,
      }, {
        status: 206 // Partial Content
      });
    }

    return NextResponse.json({
      message: "Posts import completed",
      total: posts.length,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Posts import flase",
    });
  }
}
