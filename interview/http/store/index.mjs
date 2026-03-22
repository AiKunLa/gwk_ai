import express from 'express';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(cookieParser())



// 从环境变量获取密钥 (生产环境必须配置)
// 如果未配置，仅在开发环境使用默认值并警告

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
const NODE_ENV = process.env.NODE_ENV || 'development';


if (NODE_ENV === 'production' && JWT_SECRET === 'dev-secret-key-change-in-prod') {
    console.warn('⚠️  WARNING: Using default JWT secret in production! Set JWT_SECRET env var.');
}


// ==========================================
// 3. 模拟异步数据库验证 (Async/Await)
// ==========================================
const validateUserCredentials = async (username, password) => {
    // 模拟数据库查询延迟
    await new Promise(resolve => setTimeout(resolve, 100))

    if (username === 'admin' && password === 'password123') {
        return { id: 123, role: 'admin', username };
    }
    return null;
}



// ==========================================
// 4. 路由定义 (箭头函数 + Async/Await)
// ==========================================

/**
 * 登录接口
 * POST /login
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body

    // 基础参数校验
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await validateUserCredentials(username, password)
        if (!user) return res.status(401).json({
            error: "Invalid credentials"
        })

        const playload = {
            userId: user.id, role: user.role
        }

        const token = jwt.sign(password, JWT_SECRET, {
            expiresIn: '15m',
            issuer: 'my-es6-app',
            audience: "my-es6-client"
        })

        // 3. 设置安全 Cookie
        // 注意：secure 选项在生产环境 (HTTPS) 应为 true
        // 本地开发如果是 HTTP，可能需要设为 false 否则浏览器不接收
        const isSecure = NODE_ENV === 'production';

        res.cookie('auth_token', token, {
            httpOnly: true,       // 🔒 禁止 JS 访问
            secure: isSecure,     // 🔒 仅 HTTPS (本地开发注意)
            sameSite: 'strict',   // 🔒 防御 CSRF
            maxAge: 15 * 60 * 1000, // 15 分钟
            path: '/',
            domain: NODE_ENV === 'production' ? 'yourdomain.com' : undefined
        })

        console.log(`✅ User ${username} logged in successfully.`);
        return res.json({
            message: 'Login successful',
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


const authMiddleware = (req, res, next) => {
    const token = req.cookie.auth_token

    if (!token) {
        return res.status(401).json({ error: 'Access denied: No token provided' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
}

// ==========================================
// 6. 受保护的路由示例
// ==========================================
app.get('/api/profile', authMiddleware, (req, res) => {
    // 此时 req.user 已包含用户信息
    res.json({
        message: 'Secret profile data',
        user: req.user,
        accessedAt: new Date().toISOString()
    });
});