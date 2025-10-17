/**
 * 集成示例代码
 * 展示如何在各种场景下使用防御系统
 */

/* ============================================
   示例 1: Express后端集成
   ============================================ */

// 安装: npm install express body-parser
const express = require('express');
const bodyParser = require('body-parser');
const { createExpressMiddleware } = require('./defense-middleware');

const app = express();
app.use(bodyParser.json());

// 配置防御中间件
const defenseMiddleware = createExpressMiddleware({
    mode: 'block',              // 拦截模式
    riskThreshold: 50,          // 风险阈值
    enableRateLimit: true,      // 启用速率限制
    rateLimit: 60,              // 每分钟60次
    enableLogging: true,        // 启用日志
    onAttackDetected: (input, detection, context) => {
        console.log('[SECURITY] Attack detected from', context.ip);
        console.log('[SECURITY] Risk score:', detection.riskScore);
    }
});

// 应用到特定路由
app.post('/api/chat', defenseMiddleware, async (req, res) => {
    // 此时req.body.message已经过防御检查
    // 如果被过滤，内容已被清洗
    const userMessage = req.body.message;
    
    // 调用AI模型
    const aiResponse = await callAIModel(userMessage);
    
    res.json({ 
        success: true, 
        response: aiResponse,
        defense: req.defenseResult 
    });
});

// 全局应用（保护所有路由）
// app.use(defenseMiddleware);

app.listen(3000, () => {
    console.log('Server running on port 3000 with prompt defense enabled');
});


/* ============================================
   示例 2: 纯前端Fetch API集成
   ============================================ */

// 在HTML中引入
// <script src="prompt-defense-system.js"></script>
// <script src="defense-middleware.js"></script>

const { createFetchWrapper } = window.DefenseMiddleware;

// 创建受保护的fetch函数
const protectedFetch = createFetchWrapper({
    mode: 'filter',        // 过滤模式，自动清洗危险内容
    riskThreshold: 50,
    enableLogging: true
});

// 使用方式与普通fetch相同
async function sendMessage(message) {
    try {
        const response = await protectedFetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Request blocked:', error.message);
            return;
        }
        
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}


/* ============================================
   示例 3: 输入框实时防护
   ============================================ */

// HTML:
// <textarea id="userInput" placeholder="输入消息..."></textarea>
// <button id="sendBtn">发送</button>

const { protectInputElement } = window.DefenseMiddleware;

const inputElement = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 为输入框添加防护
const protection = protectInputElement(inputElement, {
    mode: 'filter',
    riskThreshold: 50,
    autoReplace: true,  // 自动替换为清洗后的内容
    onAttackDetected: (input, detection) => {
        alert('检测到可疑内容，已自动过滤');
    }
});

// 发送消息时的额外检查
sendBtn.addEventListener('click', async () => {
    const message = inputElement.value;
    
    // 防御系统会自动处理，这里直接发送
    await sendMessage(message);
});


/* ============================================
   示例 4: WebSocket连接防护
   ============================================ */

const { ProtectedWebSocket } = window.DefenseMiddleware;

// 创建受保护的WebSocket连接
const ws = new ProtectedWebSocket('ws://localhost:8080', {
    mode: 'block',
    riskThreshold: 50
});

// 监听防御拦截事件
ws.addEventListener('defenseBlock', (event) => {
    console.error('Message blocked:', event.detail);
    alert('消息包含危险内容，发送失败');
});

// 正常使用WebSocket
ws.onopen = () => {
    console.log('Connected');
};

ws.onmessage = (event) => {
    console.log('Received:', event.data);
};

// 发送消息（会自动检查）
function sendWSMessage(message) {
    ws.send(JSON.stringify({ message }));
}


/* ============================================
   示例 5: React组件集成
   ============================================ */

// 确保已引入React和防御系统
// <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
// <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

const { useState } = React;
const { usePromptDefense } = window.DefenseMiddleware;

function ChatComponent() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { check, result, isBlocked, isFiltered } = usePromptDefense({
        mode: 'filter',
        riskThreshold: 50
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 检查输入
        const defenseResult = check(message);
        
        if (defenseResult.success) {
            // 使用清洗后的内容
            const safeMessage = defenseResult.input;
            setMessages([...messages, safeMessage]);
            setMessage('');
            
            // 发送到服务器
            sendToServer(safeMessage);
        }
    };

    return (
        <div>
            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit}>
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        check(e.target.value);
                    }}
                    placeholder="输入消息..."
                />
                
                {isBlocked && (
                    <div className="alert alert-danger">
                        ⚠️ {result.message}
                    </div>
                )}
                
                {isFiltered && (
                    <div className="alert alert-warning">
                        🛡️ 内容已过滤
                    </div>
                )}
                
                <button type="submit" disabled={isBlocked}>
                    发送
                </button>
            </form>
        </div>
    );
}


/* ============================================
   示例 6: 函数装饰器
   ============================================ */

const { defendFunction } = window.DefenseMiddleware || require('./defense-middleware');

// 原始的AI调用函数
async function callAI(prompt) {
    const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    return response.json();
}

// 使用防御装饰器包装
const protectedCallAI = defendFunction(callAI, {
    mode: 'filter',
    riskThreshold: 50
});

// 使用（如果输入危险会自动过滤或抛出错误）
try {
    const result = await protectedCallAI("用户输入内容");
    console.log(result);
} catch (error) {
    console.error('Defense error:', error.message);
}


/* ============================================
   示例 7: 直接使用防御系统类
   ============================================ */

const PromptDefenseSystem = window.PromptDefenseSystem || require('./prompt-defense-system');

// 创建防御实例
const defense = new PromptDefenseSystem({
    mode: 'block',
    riskThreshold: 50,
    enableRateLimit: true,
    rateLimit: 100,
    enableLogging: true,
    
    // 自定义规则
    customRules: [
        {
            id: 'custom-sensitive-words',
            name: '敏感词检测',
            enabled: true,
            weight: 20,
            action: 'filter',
            patterns: [
                /敏感词1|敏感词2|敏感词3/gi
            ],
            sanitize: (text) => text.replace(/敏感词\d/gi, '***')
        }
    ],
    
    // 白名单
    whitelist: [
        '这是安全的测试内容',
        /^测试：/
    ],
    
    // 回调函数
    onAttackDetected: (input, detection, context) => {
        console.log('[ALERT] Attack detected!');
        console.log('Input:', input.substring(0, 50));
        console.log('Risk Score:', detection.riskScore);
        console.log('Matched Rules:', detection.matchedRules.map(r => r.name));
        
        // 发送告警（如发送邮件、Webhook等）
        sendSecurityAlert(detection);
    },
    
    onBlocked: (input, detection, context) => {
        console.log('[BLOCKED] Request from', context.ip);
    }
});

// 检查用户输入
function checkUserInput(input, userId) {
    const result = defense.defend(input, {
        userId: userId,
        ip: getUserIP(),
        timestamp: Date.now()
    });
    
    if (!result.success) {
        // 被拦截
        console.error('Input blocked:', result.message);
        return null;
    }
    
    if (result.action === 'filtered') {
        // 已过滤
        console.warn('Input filtered');
        return result.input; // 返回清洗后的内容
    }
    
    // 安全
    return input;
}

// 获取统计信息
function showStats() {
    const stats = defense.getStats();
    console.log('Defense Statistics:');
    console.log('- Total Requests:', stats.totalRequests);
    console.log('- Blocked:', stats.blockedRequests);
    console.log('- Filtered:', stats.filteredRequests);
    console.log('- Clean:', stats.cleanRequests);
    console.log('- Block Rate:', stats.blockRate + '%');
}

// 导出日志
function exportSecurityLogs() {
    const jsonLogs = defense.exportLogs('json');
    const csvLogs = defense.exportLogs('csv');
    
    // 保存到文件或发送到服务器
    downloadFile('security-logs.json', jsonLogs);
    downloadFile('security-logs.csv', csvLogs);
}

// 动态调整配置
function adjustSecurity(level) {
    switch (level) {
        case 'low':
            defense.updateConfig({
                mode: 'monitor',
                riskThreshold: 70
            });
            break;
        case 'medium':
            defense.updateConfig({
                mode: 'filter',
                riskThreshold: 50
            });
            break;
        case 'high':
            defense.updateConfig({
                mode: 'block',
                riskThreshold: 30
            });
            break;
    }
}


/* ============================================
   示例 8: 批量检测
   ============================================ */

async function batchCheckMessages(messages) {
    const defense = new PromptDefenseSystem({ mode: 'filter' });
    
    const results = messages.map((msg, index) => {
        const result = defense.defend(msg.content, {
            messageId: msg.id,
            userId: msg.userId
        });
        
        return {
            messageId: msg.id,
            original: msg.content,
            safe: result.success,
            filtered: result.action === 'filtered' ? result.input : null,
            riskScore: result.detection?.riskScore || 0
        };
    });
    
    // 生成报告
    const report = {
        total: results.length,
        safe: results.filter(r => r.safe).length,
        filtered: results.filter(r => r.filtered).length,
        blocked: results.filter(r => !r.safe).length,
        highRisk: results.filter(r => r.riskScore >= 70)
    };
    
    return { results, report };
}


/* ============================================
   辅助函数
   ============================================ */

function callAIModel(message) {
    // 模拟AI调用
    return Promise.resolve({ response: 'AI response' });
}

function getUserIP() {
    // 获取用户IP的实现
    return '127.0.0.1';
}

function sendSecurityAlert(detection) {
    // 发送安全告警的实现
    console.log('Security alert sent');
}

function downloadFile(filename, content) {
    // 下载文件的实现
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function sendToServer(message) {
    // 发送到服务器的实现
    console.log('Sent to server:', message);
}

