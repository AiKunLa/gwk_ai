# 提示词防御系统 - 生产部署指南

## 📋 目录
- [系统架构](#系统架构)
- [快速部署](#快速部署)
- [配置说明](#配置说明)
- [集成方案](#集成方案)
- [监控与告警](#监控与告警)
- [性能优化](#性能优化)
- [安全建议](#安全建议)

---

## 系统架构

### 核心组件

```
┌─────────────────────────────────────────────┐
│          用户请求 (User Request)             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      防御中间件 (Defense Middleware)         │
│  • 速率限制                                  │
│  • 白名单检查                                │
│  • 攻击检测                                  │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   [拦截/Block]         [过滤/Filter]
        │                     │
        ▼                     ▼
   返回403错误          清洗后继续
                             │
                             ▼
                     ┌───────────────┐
                     │  应用逻辑      │
                     │  (AI调用等)   │
                     └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │   日志记录     │
                     │   统计分析     │
                     └───────────────┘
```

### 文件说明

- **prompt-defense-system.js** - 核心防御引擎
- **defense-middleware.js** - 中间件集成层
- **defense-config.json** - 配置文件
- **integration-examples.js** - 集成示例代码

---

## 快速部署

### 方式1: Node.js后端部署

#### 1. 安装依赖

```bash
npm install express body-parser
```

#### 2. 创建服务器文件 (server.js)

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { createExpressMiddleware } = require('./defense-middleware');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// 加载配置
const config = JSON.parse(fs.readFileSync('./defense-config.json'));
const envProfile = config.profiles[process.env.NODE_ENV || 'production'];

// 应用防御中间件
const defenseMiddleware = createExpressMiddleware({
    ...envProfile,
    onAttackDetected: (input, detection, context) => {
        console.error(`[SECURITY] Attack detected from ${context.ip}`);
        console.error(`[SECURITY] Risk: ${detection.riskScore}, Rules: ${detection.matchedRules.map(r => r.id).join(',')}`);
        
        // 发送告警
        sendAlert(detection, context);
    }
});

// 保护AI接口
app.post('/api/chat', defenseMiddleware, async (req, res) => {
    const { message } = req.body;
    
    // 调用AI服务
    const response = await callAIService(message);
    
    res.json({
        success: true,
        response: response,
        defense: {
            checked: true,
            riskScore: req.defenseResult.detection?.riskScore || 0
        }
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 统计端点（需要认证）
app.get('/admin/stats', authenticateAdmin, (req, res) => {
    const defense = req.app.get('defense');
    res.json(defense.getStats());
});

app.listen(3000, () => {
    console.log('Server with prompt defense running on port 3000');
});

async function callAIService(message) {
    // 实现AI服务调用
    return 'AI response';
}

function sendAlert(detection, context) {
    // 实现告警逻辑（邮件、Webhook等）
}

function authenticateAdmin(req, res, next) {
    // 实现管理员认证
    next();
}
```

#### 3. 启动服务

```bash
NODE_ENV=production node server.js
```

---

### 方式2: 纯前端部署

#### 1. 引入脚本

```html
<!DOCTYPE html>
<html>
<head>
    <title>受保护的应用</title>
</head>
<body>
    <textarea id="userInput" placeholder="输入消息..."></textarea>
    <button id="sendBtn">发送</button>

    <!-- 引入防御系统 -->
    <script src="prompt-defense-system.js"></script>
    <script src="defense-middleware.js"></script>
    
    <script>
        const { protectInputElement, createFetchWrapper } = window.DefenseMiddleware;
        
        // 保护输入框
        const input = document.getElementById('userInput');
        protectInputElement(input, {
            mode: 'filter',
            riskThreshold: 50,
            autoReplace: true
        });
        
        // 保护API调用
        const protectedFetch = createFetchWrapper({
            mode: 'block',
            riskThreshold: 50
        });
        
        document.getElementById('sendBtn').addEventListener('click', async () => {
            const message = input.value;
            
            const response = await protectedFetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Response:', data);
            } else {
                alert('请求被防御系统拦截');
            }
        });
    </script>
</body>
</html>
```

---

### 方式3: Cloudflare Workers部署

```javascript
// worker.js
import { PromptDefenseSystem } from './prompt-defense-system.js';

const defense = new PromptDefenseSystem({
    mode: 'block',
    riskThreshold: 50,
    enableRateLimit: true
});

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }
    
    try {
        const body = await request.json();
        const input = body.message || body.prompt || body.input;
        
        if (!input) {
            return new Response('No input provided', { status: 400 });
        }
        
        // 防御检查
        const result = defense.defend(input, {
            ip: request.headers.get('CF-Connecting-IP'),
            country: request.headers.get('CF-IPCountry')
        });
        
        if (!result.success) {
            return new Response(JSON.stringify({
                error: 'Request blocked',
                message: result.message
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 转发到后端
        const backendResponse = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: result.input })
        });
        
        return backendResponse;
        
    } catch (error) {
        return new Response('Internal error', { status: 500 });
    }
}
```

---

## 配置说明

### 环境配置

使用 `defense-config.json` 管理不同环境的配置：

```javascript
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./defense-config.json'));

// 根据环境选择配置
const profile = config.profiles[process.env.NODE_ENV || 'production'];

const defense = new PromptDefenseSystem(profile);
```

### 配置参数详解

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | string | `'block'` | 防御模式：`monitor`(监控), `filter`(过滤), `block`(拦截) |
| `riskThreshold` | number | `50` | 风险阈值(0-100)，超过此值触发防御 |
| `enableSanitization` | boolean | `true` | 是否启用内容清洗 |
| `enableLogging` | boolean | `true` | 是否记录日志 |
| `enableRateLimit` | boolean | `true` | 是否启用速率限制 |
| `rateLimit` | number | `60` | 每分钟最大请求数 |
| `maxLogs` | number | `1000` | 最大日志条数 |

### 自定义规则

```javascript
const defense = new PromptDefenseSystem({
    mode: 'block',
    customRules: [
        {
            id: 'custom-policy',
            name: '自定义策略',
            enabled: true,
            weight: 25,
            action: 'filter',
            patterns: [
                /特定关键词1/gi,
                /特定关键词2/gi
            ],
            sanitize: (text) => {
                return text.replace(/特定关键词/gi, '***');
            }
        }
    ]
});
```

### 白名单配置

```javascript
const defense = new PromptDefenseSystem({
    whitelist: [
        '系统测试消息',                    // 字符串匹配
        /^官方公告：/,                     // 正则匹配
        (input) => input.startsWith('VIP')  // 自定义函数
    ]
});
```

---

## 集成方案

### Express应用集成

```javascript
const { createExpressMiddleware } = require('./defense-middleware');

app.use('/api', createExpressMiddleware({
    mode: 'filter',
    riskThreshold: 50
}));
```

### Koa应用集成

```javascript
const PromptDefenseSystem = require('./prompt-defense-system');
const defense = new PromptDefenseSystem({ mode: 'block' });

app.use(async (ctx, next) => {
    const input = ctx.request.body.message;
    
    if (input) {
        const result = defense.defend(input, {
            userId: ctx.state.user?.id,
            ip: ctx.ip
        });
        
        if (!result.success) {
            ctx.status = 403;
            ctx.body = { error: result.message };
            return;
        }
        
        if (result.action === 'filtered') {
            ctx.request.body.message = result.input;
        }
    }
    
    await next();
});
```

### Next.js API Routes

```javascript
// pages/api/chat.js
import { PromptDefenseSystem } from '../../lib/prompt-defense-system';

const defense = new PromptDefenseSystem({ mode: 'filter' });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const result = defense.defend(req.body.message, {
        userId: req.session?.userId,
        ip: req.headers['x-real-ip'] || req.connection.remoteAddress
    });
    
    if (!result.success) {
        return res.status(403).json({
            error: 'Request blocked',
            message: result.message
        });
    }
    
    // 处理请求
    const aiResponse = await callAI(result.input);
    res.status(200).json({ response: aiResponse });
}
```

---

## 监控与告警

### 日志记录

```javascript
const defense = new PromptDefenseSystem({
    enableLogging: true,
    onAttackDetected: (input, detection, context) => {
        // 记录到日志文件
        logger.warn({
            type: 'SECURITY_ALERT',
            timestamp: new Date().toISOString(),
            ip: context.ip,
            userId: context.userId,
            riskScore: detection.riskScore,
            matchedRules: detection.matchedRules.map(r => r.id),
            inputPreview: input.substring(0, 100)
        });
    }
});
```

### 导出日志

```javascript
// 定期导出日志
setInterval(() => {
    const logs = defense.exportLogs('json');
    fs.writeFileSync(
        `./logs/defense-${Date.now()}.json`,
        logs
    );
    defense.clearLogs();
}, 3600000); // 每小时
```

### 统计监控

```javascript
// 监控端点
app.get('/metrics', (req, res) => {
    const stats = defense.getStats();
    
    res.json({
        ...stats,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
```

### Webhook告警

```javascript
const defense = new PromptDefenseSystem({
    onAttackDetected: async (input, detection, context) => {
        if (detection.riskScore >= 70) {
            await fetch('https://your-webhook.com/alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alert: 'High-risk attack detected',
                    riskScore: detection.riskScore,
                    ip: context.ip,
                    timestamp: new Date().toISOString()
                })
            });
        }
    }
});
```

---

## 性能优化

### 1. 缓存优化

```javascript
const LRU = require('lru-cache');

const cache = new LRU({
    max: 1000,
    ttl: 60000 // 1分钟
});

function cachedDefend(input, context) {
    const cacheKey = `${input}-${context.userId}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const result = defense.defend(input, context);
    cache.set(cacheKey, result);
    
    return result;
}
```

### 2. 异步处理

```javascript
// 使用Worker Threads处理大量请求
const { Worker } = require('worker_threads');

const worker = new Worker('./defense-worker.js');

function defendAsync(input, context) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ input, context });
        worker.once('message', resolve);
        worker.once('error', reject);
    });
}
```

### 3. 批量检测

```javascript
async function batchDefend(inputs) {
    return Promise.all(
        inputs.map(input => defense.defend(input.text, input.context))
    );
}
```

---

## 安全建议

### 1. 多层防御

```
用户输入 → 前端过滤 → 后端拦截 → 业务逻辑 → 输出过滤
```

### 2. 定期更新规则

```javascript
// 从远程服务器更新规则
async function updateRules() {
    const response = await fetch('https://your-api.com/defense-rules');
    const newRules = await response.json();
    
    newRules.forEach(rule => {
        defense.addCustomRule(rule);
    });
}

// 每天更新一次
setInterval(updateRules, 86400000);
```

### 3. 安全配置检查清单

- [ ] 生产环境使用 `block` 模式
- [ ] 启用速率限制
- [ ] 配置日志记录和告警
- [ ] 设置合适的风险阈值
- [ ] 定期审查拦截日志
- [ ] 维护白名单和自定义规则
- [ ] 监控系统性能指标
- [ ] 实施数据加密传输
- [ ] 定期安全审计
- [ ] 备份防御日志

### 4. 与其他安全措施结合

```javascript
// 结合JWT验证
app.post('/api/chat', 
    authenticateJWT,              // JWT认证
    validateCSRFToken,            // CSRF保护
    sanitizeInput,                // 输入清理
    defenseMiddleware,            // 提示词防御
    rateLimiter,                  // 全局速率限制
    async (req, res) => {
        // 业务逻辑
    }
);
```

---

## 故障排查

### 常见问题

#### 1. 误报过多

**解决方案：**
- 降低风险阈值
- 添加白名单
- 调整规则权重
- 使用 `filter` 模式替代 `block`

#### 2. 性能问题

**解决方案：**
- 启用缓存
- 减少规则数量
- 优化正则表达式
- 使用异步处理

#### 3. 日志过大

**解决方案：**
- 减小 `maxLogs` 值
- 定期清理日志
- 只记录高风险请求
- 使用日志轮转

---

## 生产环境检查表

部署前请确认：

- [x] 已选择合适的防御模式
- [x] 配置了风险阈值
- [x] 启用了速率限制
- [x] 配置了日志记录
- [x] 设置了告警机制
- [x] 添加了健康检查端点
- [x] 配置了监控指标
- [x] 测试了各种攻击场景
- [x] 准备了回滚方案
- [x] 编写了运维文档

---

## 技术支持

如需帮助，请参考：
- [集成示例](integration-examples.js)
- [API文档](prompt-defense-system.js)
- [配置参考](defense-config.json)

祝部署顺利！🚀

