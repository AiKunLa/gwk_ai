import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { emailRegex, passwordRegex } from "@/lib/regexp";

/**
 * 用户注册
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  //
  try {
    const { email, password } = await request.json();
    // 使用正则表达式来验证邮箱
    // .表示什么都可以，匹配一个
    // + 一次或多次
    // @ 是邮箱中必须要有的
    // \. 表示转翻译
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱格式无效" }, { status: 400 });
    }

    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "密码需要6-18位，不能全为数字" },
        { status: 400 }
      );
    }

    // 检查是否已经注册
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "user already exists",
        },
        {
          status: 409,
        }
      );
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword, // 进行加密存储
      },
    });
    return NextResponse.json(
      {
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
