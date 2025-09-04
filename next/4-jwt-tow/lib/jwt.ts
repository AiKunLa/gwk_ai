import { SignJWT, jwtVerify } from "jose"; // node中用于处理jwt，
import { cookies } from "next/headers";

// 获取JWT_SECRET_KEY  key 加盐
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error("JWT_SECRET_KEY is not exist");
  // 将key编码为Uint8Array类型的字节数组 这是因为jose加密库要求key必须是二进制的
  return new TextEncoder().encode(secret);
};

export const createTokens = async (userId: number) => {
  const accessToken = await new SignJWT({ userId })
    // 设置头部，签名算法
    .setProtectedHeader({ alg: "HS256" })
    // 设置jwt颁发时间
    .setIssuedAt()
    // 设置过期时间
    .setExpirationTime("15m")
    // 签名
    .sign(getJwtSecretKey());

  const refreshToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * 将token放入cookie中
 * @param accessToken 
 * @param refreshToken 
 */
export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string
) => {
  // next 提供了操作cookies的模块
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true, // 这个表示不能用javascript操作cookie  防止XSS攻击（通过js获取cookie）
    maxAge: 60 * 15, // 15分钟
    sameSite: "strict", // SameSite 可防止跨站请求伪造（CSRF）攻击，限制 Cookie 在跨域请求中的自动发送，提升安全性。
    path: "/", // 能够携带的请求路径
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true, // 这个表示不能用javascript操作cookie  防止XSS攻击（通过js获取cookie）
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: "strict",
    path: "/", //
  });
  
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload
  } catch (error) {}
};
