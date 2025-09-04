import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// 定义需要认证的路径
const protectedRoutes = ["/dashboard", "/profile"];
// 定义公共路径（不需要认证）

// 中间件层，处理请求的身份验证和路由控制
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 如果是公共路径，直接放行
  if (!protectedRoutes.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;
  const accessToken = request.cookies.get("access_token")?.value;

  console.log("refreshToken", refreshToken);
  console.log("accessToken", accessToken);

  // 如果没有token，重定向到登录页
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 尝试使用accessToken
  if (accessToken) {
    const accessPayload = await verifyToken(accessToken);
    if (accessPayload) {
      // 设置自定义请求头，存储用户数据
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", accessPayload.userId as string);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // 尝试使用refreshToken刷新访问令牌
  if (refreshToken) {
    const refreshPayload = await verifyToken(refreshToken);
    if (refreshPayload) {
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", request.url);
      return NextResponse.redirect(refreshUrl);
    }
  }

  // 如果所有令牌都无效，重定向到登录页
  return NextResponse.redirect(new URL("/login", request.url));
}
