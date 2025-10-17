/**
 * 服务器示例 - 展示如何在Express中使用防御系统
 * 运行: node server-example.js
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createExpressMiddleware } = require('./defense-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（用于演示页面）
app.use(express.static(__dirname));

// 创建防御中间件
const defenseMiddleware = createExpressMiddleware({
    mode: process.env.DEFENSE_MODE || 'block',
    riskThreshold: parseInt(process.env.RISK_THRESHOLD || '50'),
    enableRateLimit: true,
    rateLimit: 60,
    enableLogging: true,
    
    onAttackDetected: (input, detection, context) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚨 [SECURITY ALERT] Attack Detected!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Time:', new Date().toISOString());
        console.log('IP:', context.ip);
        console.log('User:', context.userId || 'anonymous');
        console.log('Risk Score:', detection.riskScore);
        console.log('Risk Level:', detection.riskLevel);
        console.log('Matched Rules:', detection.matchedRules.map(r => r.name).join(', '));
        console.log('Input Preview:', input.substring(0, 100));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    },
    
    onBlocked: (input, detection, context) => {
        console.log(`⛔ [BLOCKED] Request from ${context.ip} - Risk: ${detection.riskScore}`);
    },
    
    onFiltered: (input, sanitized, detection, context) => {
        console.log(`🛡️  [FILTERED] Content sanitized - Risk: ${detection.riskScore}`);
    }
});

// ============================================
// API 路由
// ============================================

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'production-demo.html'));
});

// AI聊天接口（受保护）
app.post('/api/chat', defenseMiddleware, async (req, res) => {
    const { message } = req.body;
    
    try {
        // 模拟AI响应
        const aiResponse = await simulateAIResponse(message);
        
        res.json({
            success: true,
            response: aiResponse,
            defense: {
                checked: true,
                action: req.defenseResult.action,
                riskScore: req.defenseResult.detection?.riskScore || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 统计信息（简单示例，生产环境需要认证）
app.get('/api/stats', (req, res) => {
    // 这里应该从防御系统获取真实统计
    res.json({
        message: '统计功能需要在实际部署时实现',
        note: '请参考 DEPLOYMENT.md 了解如何实现完整的监控'
    });
});

// ============================================
// 辅助函数
// ============================================

/**
 * 模拟AI响应
 */
async function simulateAIResponse(message) {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 简单的回复逻辑
    const responses = [
        '我理解你的问题。让我来帮助你。',
        '这是一个很好的问题。根据我的理解...',
        '感谢你的提问。我的回答是...',
        '让我想想...好的，我认为...'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================
// 错误处理
// ============================================

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// 启动服务器
// ============================================

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🛡️  提示词防御系统 - 服务器已启动');
    console.log('='.repeat(60));
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📊 Demo: http://localhost:${PORT}/production-demo.html`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
    console.log('\n📝 配置:');
    console.log(`   - 模式: ${process.env.DEFENSE_MODE || 'block'}`);
    console.log(`   - 风险阈值: ${process.env.RISK_THRESHOLD || '50'}`);
    console.log(`   - 速率限制: 60 请求/分钟`);
    console.log('\n💡 提示:');
    console.log('   - 访问演示页面测试防御功能');
    console.log('   - 查看控制台了解防御日志');
    console.log('   - 按 Ctrl+C 停止服务器');
    console.log('='.repeat(60) + '\n');
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('\n🛑 收到关闭信号，正在优雅关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n\n👋 服务器已停止');
    process.exit(0);
});

