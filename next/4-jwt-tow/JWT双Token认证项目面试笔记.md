# JWT双Token认证项目面试笔记

## 项目概述
这是一个基于Next.js 14实现的JWT双Token认证系统，采用Access Token + Refresh Token的安全认证机制，有效平衡了安全性和用户体验。

## 核心技术栈
- **前端框架**: Next.js 14 (App Router)
- **数据库**: Prisma + SQLite
- **JWT处理**: jose库
- **密码加密**: bcryptjs
- **样式**: Tailwind CSS

## 关键实现流程

### 1. 登录认证流程

#### 前端登录页面 (`app/login/page.tsx`)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  
  // 登录成功后自动跳转到dashboard
}
```

#### 后端登录API (`app/api/auth/login/route.ts`)
**关键实现点：**
1. **输入验证**: 使用正则表达式验证邮箱格式
2. **密码校验**: 使用bcrypt比较加密密码
3. **双Token生成**: 
   - Access Token: 15分钟有效期
   - Refresh Token: 7天有效期
4. **安全存储**: 
   - Refresh Token存入数据库（防止盗用）
   - 两个Token都设置为httpOnly cookie

```typescript
// 核心代码片段
const { accessToken, refreshToken } = await createTokens(user.id);

// 存储refreshToken到数据库
await prisma.user.update({
  where: { id: user.id },
  data: { refreshToken }
});

// 设置安全cookie
setAuthCookies(accessToken, refreshToken);
```

### 2. JWT工具库实现 (`lib/jwt.ts`)

#### Token创建
```typescript
export const createTokens = async (userId: number) => {
  const accessToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")  // 短期有效
    .sign(getJwtSecretKey());

  const refreshToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")   // 长期有效
    .sign(getJwtSecretKey());

  return { accessToken, refreshToken };
};
```

#### 安全Cookie设置
```typescript
export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();
  
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,        // 防止XSS攻击
    maxAge: 60 * 15,       // 15分钟
    sameSite: "strict",    // 防止CSRF攻击
    path: "/",
  });
  
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,  // 7天
    sameSite: "strict",
    path: "/",
  });
};
```

### 3. 中间件认证机制 (`middleware.ts`)

**核心认证逻辑：**
1. **路径保护**: 定义需要认证的路由
2. **Token验证**: 优先验证Access Token
3. **自动刷新**: Access Token失效时自动使用Refresh Token刷新
4. **用户信息传递**: 通过请求头传递用户ID

```typescript
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 检查是否为受保护路由
  if (!protectedRoutes.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // 优先验证Access Token
  if (accessToken) {
    const accessPayload = await verifyToken(accessToken);
    if (accessPayload) {
      // 在请求头中传递用户信息
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", accessPayload.userId as string);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
  }

  // Access Token失效，尝试刷新
  if (refreshToken) {
    const refreshPayload = await verifyToken(refreshToken);
    if (refreshPayload) {
      // 重定向到刷新API
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", request.url);
      return NextResponse.redirect(refreshUrl);
    }
  }

  // 所有Token都无效，跳转登录
  return NextResponse.redirect(new URL("/login", request.url));
}
```

### 4. Token刷新机制 (`app/api/auth/refresh/route.ts`)

**安全刷新流程：**
1. **Token验证**: 验证Refresh Token有效性
2. **数据库校验**: 与数据库中存储的Refresh Token对比（防止盗用）
3. **Token轮换**: 生成新的Access Token和Refresh Token
4. **数据库更新**: 更新数据库中的Refresh Token
5. **Cookie更新**: 设置新的Cookie并重定向

```typescript
export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  
  // 验证Refresh Token
  const refreshPayload = await verifyToken(refreshToken);
  const userId = refreshPayload.userId as number;

  // 数据库安全校验
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 生成新Token并更新数据库
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
    await createTokens(userId);
    
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: newRefreshToken }
  });

  // 设置新Cookie并重定向
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.set("access_token", newAccessToken, { /* 配置 */ });
  response.cookies.set("refresh_token", newRefreshToken, { /* 配置 */ });
  
  return response;
}
```

## 项目亮点与安全特性

### 1. 安全性设计
- **双Token机制**: 分离访问权限和刷新权限
- **Token轮换**: 每次刷新都生成新的Refresh Token
- **数据库验证**: Refresh Token与数据库对比，防止盗用
- **httpOnly Cookie**: 防止XSS攻击获取Token
- **SameSite策略**: 防止CSRF攻击

### 2. 用户体验优化
- **无感刷新**: 用户无需手动重新登录
- **自动重定向**: Token刷新后自动跳转到目标页面
- **中间件拦截**: 在路由层面统一处理认证逻辑

### 3. 技术实现亮点
- **Next.js App Router**: 使用最新的App Router架构
- **Prisma ORM**: 类型安全的数据库操作
- **jose库**: 现代化的JWT处理库
- **TypeScript**: 全栈类型安全

## 面试要点总结

### 问题1: 为什么使用双Token而不是单Token？
**回答要点：**
- 安全性：Access Token短期有效，即使泄露风险可控
- 用户体验：Refresh Token长期有效，避免频繁登录
- 灵活控制：可以随时撤销Refresh Token强制重新登录

### 问题2: 如何防止Token被盗用？
**回答要点：**
- httpOnly Cookie防止XSS攻击
- SameSite策略防止CSRF攻击
- Refresh Token存储在数据库中进行二次验证
- Token轮换机制，每次刷新都更新Refresh Token

### 问题3: 中间件的作用是什么？
**回答要点：**
- 统一认证逻辑，避免在每个页面重复验证
- 自动Token刷新，提升用户体验
- 路由级别的访问控制
- 通过请求头传递用户信息给后续处理

### 问题4: 项目中的安全考虑有哪些？
**回答要点：**
- 密码使用bcrypt加密存储
- JWT使用强密钥签名
- Cookie设置安全属性（httpOnly, sameSite, secure）
- 输入验证（邮箱格式、密码强度）
- 数据库连接及时释放

## 可扩展功能
1. **设备管理**: 记录每个Refresh Token对应的设备信息
2. **登录日志**: 记录用户登录行为和异常访问
3. **Token黑名单**: 实现Token撤销机制
4. **多端登录**: 支持同一用户多设备登录管理
5. **权限控制**: 基于角色的访问控制(RBAC)

这个项目展示了现代Web应用中JWT认证的最佳实践，在安全性和用户体验之间找到了很好的平衡点。