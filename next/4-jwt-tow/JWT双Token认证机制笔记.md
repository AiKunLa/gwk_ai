# JWT双Token认证机制笔记

## 概述
JWT双Token认证是一种安全的身份验证机制，使用两个不同的token来提高安全性：
- **Access Token（访问令牌）**：短期有效，用于API请求认证
- **Refresh Token（刷新令牌）**：长期有效，用于刷新Access Token

## 核心优势
1. **安全性提升**：即使Access Token被泄露，由于其短期有效性，风险可控
2. **用户体验**：用户无需频繁登录，Refresh Token可自动续期
3. **灵活控制**：可以随时撤销Refresh Token，强制用户重新登录

## 实现分析（基于Next.js）

### 1. 登录流程
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    
    if (response.ok) {
      const data = await response.json()
      // 服务器返回双token
      // accessToken: 短期token（如15分钟）
      // refreshToken: 长期token（如7天）
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 2. Token存储策略
- **Access Token**: 存储在内存中或sessionStorage（更安全）
- **Refresh Token**: 存储在httpOnly cookie中（防止XSS攻击）

### 3. 自动刷新机制
```typescript
// 拦截器示例
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Access Token过期，尝试刷新
      const newToken = await refreshAccessToken()
      if (newToken) {
        // 重试原请求
        return axios.request(error.config)
      } else {
        // 刷新失败，跳转登录页
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)
```

## 安全考虑

### 1. Token有效期设置
- Access Token: 15-30分钟
- Refresh Token: 7-30天

### 2. 存储安全
- 避免在localStorage中存储敏感token
- 使用httpOnly cookie存储Refresh Token
- 考虑使用Secure和SameSite属性

### 3. 传输安全
- 始终使用HTTPS
- 在请求头中携带Access Token: `Authorization: Bearer <token>`

## 最佳实践

### 1. 服务端实现
```javascript
// 登录API示例
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  
  // 验证用户凭据
  const user = await validateUser(username, password)
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  
  // 生成双token
  const accessToken = jwt.sign(
    { userId: user.id, username: user.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
  
  // 设置httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
  })
  
  res.json({ accessToken, user: { id: user.id, username: user.username } })
})
```

### 2. 刷新Token API
```javascript
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.cookies
  
  if (!refreshToken) {
    return res.status(401).json({ error: '未找到刷新令牌' })
  }
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    const user = await getUserById(decoded.userId)
    
    // 生成新的Access Token
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    
    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ error: '刷新令牌无效' })
  }
})
```

### 3. 前端状态管理
```typescript
// 使用Context管理认证状态
const AuthContext = createContext<{
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 初始化时检查认证状态
  useEffect(() => {
    checkAuthStatus()
  }, [])
  
  const checkAuthStatus = async () => {
    try {
      // 尝试刷新token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        // 设置用户状态
        setUser(data.user)
      }
    } catch (error) {
      console.error('认证检查失败:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 注意事项

1. **Token轮换**：考虑在刷新Access Token时也轮换Refresh Token
2. **设备管理**：记录Refresh Token对应的设备信息，支持远程登出
3. **异常处理**：妥善处理网络异常、token过期等情况
4. **监控告警**：监控异常的token刷新行为，及时发现安全威胁

## 总结

JWT双Token认证机制通过分离访问权限和刷新权限，在安全性和用户体验之间找到了良好的平衡点。正确实施这种机制需要前后端的密切配合，以及对安全细节的充分考虑。