/**
 * 防御中间件 - 用于集成到实际应用
 * 支持Express、Fetch API等多种场景
 */

/**
 * Express中间件
 * 使用示例：
 * const { createExpressMiddleware } = require('./defense-middleware');
 * app.use('/api/chat', createExpressMiddleware(config));
 */
function createExpressMiddleware(config = {}) {
    const PromptDefenseSystem = require('./prompt-defense-system');
    const defense = new PromptDefenseSystem(config);

    return function promptDefenseMiddleware(req, res, next) {
        // 提取用户输入（支持多种字段名）
        const input = req.body.message 
                   || req.body.prompt 
                   || req.body.input 
                   || req.body.text 
                   || req.query.q;

        if (!input) {
            return next(); // 没有输入，跳过检查
        }

        // 构建上下文
        const context = {
            userId: req.user?.id || req.session?.userId,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            path: req.path,
            method: req.method
        };

        // 执行防御检查
        const result = defense.defend(input, context);

        // 根据结果采取行动
        if (!result.success) {
            // 被拦截
            return res.status(403).json({
                error: 'Request Blocked',
                message: result.message,
                reason: result.reason,
                detection: result.detection
            });
        }

        if (result.action === 'filtered') {
            // 输入被过滤，替换原始输入
            req.body.message = result.input;
            req.body.prompt = result.input;
            req.body.input = result.input;
            req.body.text = result.input;
            
            // 添加警告头
            res.setHeader('X-Content-Filtered', 'true');
            res.setHeader('X-Risk-Score', result.detection.riskScore);
        }

        if (result.action === 'monitored') {
            // 仅监控，添加信息头
            res.setHeader('X-Risk-Score', result.detection.riskScore);
            res.setHeader('X-Risk-Level', result.detection.riskLevel);
        }

        // 将检测结果附加到请求对象
        req.defenseResult = result;

        next();
    };
}

/**
 * Fetch API包装器
 * 使用示例：
 * const protectedFetch = createFetchWrapper(config);
 * const response = await protectedFetch('/api/chat', { body: { message: input } });
 */
function createFetchWrapper(config = {}) {
    const PromptDefenseSystem = typeof window !== 'undefined' 
        ? window.PromptDefenseSystem 
        : require('./prompt-defense-system');
    
    const defense = new PromptDefenseSystem(config);

    return async function protectedFetch(url, options = {}) {
        // 提取请求体中的输入
        let body = options.body;
        let input = null;

        if (typeof body === 'string') {
            try {
                const parsed = JSON.parse(body);
                input = parsed.message || parsed.prompt || parsed.input || parsed.text;
            } catch (e) {
                // 无法解析，跳过检查
            }
        } else if (typeof body === 'object') {
            input = body.message || body.prompt || body.input || body.text;
        }

        if (input) {
            // 执行防御检查
            const context = {
                url: url,
                method: options.method || 'GET'
            };

            const result = defense.defend(input, context);

            if (!result.success) {
                // 被拦截，返回模拟的错误响应
                return {
                    ok: false,
                    status: 403,
                    statusText: 'Forbidden',
                    json: async () => ({
                        error: 'Request Blocked',
                        message: result.message,
                        reason: result.reason
                    })
                };
            }

            if (result.action === 'filtered') {
                // 替换过滤后的输入
                if (typeof body === 'string') {
                    const parsed = JSON.parse(body);
                    parsed.message = result.input;
                    parsed.prompt = result.input;
                    parsed.input = result.input;
                    parsed.text = result.input;
                    options.body = JSON.stringify(parsed);
                } else if (typeof body === 'object') {
                    body.message = result.input;
                    body.prompt = result.input;
                    body.input = result.input;
                    body.text = result.input;
                }
            }
        }

        // 执行原始fetch
        return fetch(url, options);
    };
}

/**
 * WebSocket防御包装器
 */
class ProtectedWebSocket {
    constructor(url, config = {}, protocols) {
        this.defense = new (typeof window !== 'undefined' 
            ? window.PromptDefenseSystem 
            : require('./prompt-defense-system'))(config);
        
        this.ws = new WebSocket(url, protocols);
        this.originalSend = this.ws.send.bind(this.ws);
        
        // 覆盖send方法
        this.ws.send = this.protectedSend.bind(this);
        
        // 代理其他属性和方法
        this.proxyWebSocketMethods();
    }

    protectedSend(data) {
        let input = null;

        // 尝试解析数据
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                input = parsed.message || parsed.prompt || parsed.input || parsed.text;
            } catch (e) {
                input = data;
            }
        }

        if (input) {
            const result = this.defense.defend(input, { protocol: 'websocket' });

            if (!result.success) {
                console.error('[Defense] Message blocked:', result.message);
                this.dispatchEvent(new CustomEvent('defenseBlock', { detail: result }));
                return; // 不发送
            }

            if (result.action === 'filtered') {
                // 使用过滤后的内容
                if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        parsed.message = result.input;
                        parsed.prompt = result.input;
                        parsed.input = result.input;
                        parsed.text = result.input;
                        data = JSON.stringify(parsed);
                    } catch (e) {
                        data = result.input;
                    }
                }
            }
        }

        this.originalSend(data);
    }

    proxyWebSocketMethods() {
        // 代理所有WebSocket属性和方法
        const ws = this.ws;
        const self = this;

        ['addEventListener', 'removeEventListener', 'dispatchEvent', 'close'].forEach(method => {
            self[method] = function(...args) {
                return ws[method](...args);
            };
        });

        ['onopen', 'onclose', 'onerror', 'onmessage'].forEach(prop => {
            Object.defineProperty(self, prop, {
                get() { return ws[prop]; },
                set(value) { ws[prop] = value; }
            });
        });

        Object.defineProperty(self, 'readyState', {
            get() { return ws.readyState; }
        });
    }
}

/**
 * 输入框防御装饰器（前端使用）
 */
function protectInputElement(inputElement, config = {}) {
    if (typeof window === 'undefined') {
        throw new Error('protectInputElement只能在浏览器环境中使用');
    }

    const defense = new window.PromptDefenseSystem(config);
    
    // 创建提示元素
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'defense-feedback';
    feedbackElement.style.cssText = `
        margin-top: 4px;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        display: none;
    `;
    inputElement.parentNode.insertBefore(feedbackElement, inputElement.nextSibling);

    // 监听输入
    let debounceTimer;
    inputElement.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const result = defense.defend(e.target.value);
            
            if (!result.success) {
                // 显示警告
                feedbackElement.style.display = 'block';
                feedbackElement.style.backgroundColor = '#fee';
                feedbackElement.style.color = '#c00';
                feedbackElement.style.borderLeft = '3px solid #c00';
                feedbackElement.textContent = `⚠️ ${result.message}`;
                
                // 可选：禁用提交按钮
                const form = inputElement.closest('form');
                if (form) {
                    const submitBtn = form.querySelector('[type="submit"]');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                    }
                }
            } else if (result.action === 'filtered') {
                // 显示已过滤提示
                feedbackElement.style.display = 'block';
                feedbackElement.style.backgroundColor = '#ffa';
                feedbackElement.style.color = '#660';
                feedbackElement.style.borderLeft = '3px solid #fa0';
                feedbackElement.textContent = `🛡️ ${result.message}`;
                
                // 自动替换输入
                if (config.autoReplace) {
                    e.target.value = result.input;
                }
            } else {
                // 安全内容
                feedbackElement.style.display = 'none';
                
                const form = inputElement.closest('form');
                if (form) {
                    const submitBtn = form.querySelector('[type="submit"]');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                }
            }
        }, 500);
    });

    return {
        destroy() {
            feedbackElement.remove();
        }
    };
}

/**
 * React Hook (如果使用React)
 */
function usePromptDefense(config = {}) {
    if (typeof window === 'undefined' || !window.React) {
        throw new Error('usePromptDefense需要React环境');
    }

    const { useState, useCallback, useRef } = window.React;
    
    const defenseRef = useRef(new window.PromptDefenseSystem(config));
    const [result, setResult] = useState(null);

    const check = useCallback((input) => {
        const checkResult = defenseRef.current.defend(input);
        setResult(checkResult);
        return checkResult;
    }, []);

    const reset = useCallback(() => {
        setResult(null);
    }, []);

    return {
        check,
        reset,
        result,
        isBlocked: result && !result.success,
        isFiltered: result && result.action === 'filtered',
        isSafe: result && result.action === 'clean'
    };
}

/**
 * 通用装饰器函数
 */
function defendFunction(targetFunction, config = {}) {
    const PromptDefenseSystem = typeof window !== 'undefined'
        ? window.PromptDefenseSystem
        : require('./prompt-defense-system');
    
    const defense = new PromptDefenseSystem(config);

    return function(...args) {
        // 假设第一个参数是用户输入
        const input = args[0];
        
        if (typeof input === 'string') {
            const result = defense.defend(input);
            
            if (!result.success) {
                throw new Error(`Defense blocked: ${result.message}`);
            }
            
            if (result.action === 'filtered') {
                args[0] = result.input;
            }
        }

        return targetFunction.apply(this, args);
    };
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createExpressMiddleware,
        createFetchWrapper,
        ProtectedWebSocket,
        defendFunction
    };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
    window.DefenseMiddleware = {
        createFetchWrapper,
        ProtectedWebSocket,
        protectInputElement,
        usePromptDefense,
        defendFunction
    };
}

