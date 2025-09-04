import { NextRequest, NextResponse } from "next/server";
import { emailRegex, passwordRegex } from "@/lib/regexp";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createTokens, setAuthCookies } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    // 判定email password是否合理
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "账号格式错误",
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      return NextResponse.json(
        {
          error: "账号不存在",
        },
        { status: 401 }
      );
    // 校验密码
    if (!user || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json(
        {
          error: "密码错误",
        },
        { status: 401 }
      );

    const { accessToken, refreshToken } = await createTokens(user.id);

    // 将refreshToken 存储到数据库中，以便于之后用于无感刷新
    // 存储到数据库中，可以防止盗用
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    // 将token放入 cookie中
    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        message: "Success Get Token",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Interval server error",
      },
      {
        status: 500,
      }
    );
  } finally {
    // 释放数据对象
    await prisma.$disconnect();
  }
}
