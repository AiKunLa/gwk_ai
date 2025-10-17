/**
 * 提示词防御系统 - 生产级实现
 * 提供真正的防御能力：检测、拦截、清洗、日志记录
 */

class PromptDefenseSystem {
    constructor(config = {}) {
        // 防御配置
        this.config = {
            // 防御模式：'monitor'(监控), 'filter'(过滤), 'block'(拦截)
            mode: config.mode || 'block',
            
            // 风险阈值：超过此分数将触发防御动作
            riskThreshold: config.riskThreshold || 50,
            
            // 是否启用自动清洗
            enableSanitization: config.enableSanitization !== false,
            
            // 是否记录日志
            enableLogging: config.enableLogging !== false,
            
            // 是否启用速率限制
            enableRateLimit: config.enableRateLimit !== false,
            
            // 速率限制配置（每分钟最大请求数）
            rateLimit: config.rateLimit || 60,
            
            // 自定义规则
            customRules: config.customRules || [],
            
            // 白名单（跳过检测的内容）
            whitelist: config.whitelist || [],
            
            // 回调函数
            onAttackDetected: config.onAttackDetected || null,
            onBlocked: config.onBlocked || null,
            onFiltered: config.onFiltered || null
        };

        // 初始化日志系统
        this.logs = [];
        this.maxLogs = config.maxLogs || 1000;

        // 初始化速率限制
        this.requestCounts = new Map();

        // 统计数据
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            filteredRequests: 0,
            cleanRequests: 0,
            startTime: Date.now()
        };

        // 初始化防御规则
        this.rules = this.initializeRules();
    }

    /**
     * 初始化防御规则
     */
    initializeRules() {
        const baseRules = [
            {
                id: 'injection',
                name: '指令注入防御',
                enabled: true,
                weight: 35,
                action: 'block', // block, filter, monitor
                patterns: [
                    /忽略(之前|以前|上面|前面|所有).{0,10}(指令|规则|要求|设置)/gi,
                    /无视(之前|以前|上面|前面|所有).{0,10}(指令|规则|要求|限制)/gi,
                    /不要(遵循|执行|理会|管).{0,10}(指令|规则|限制)/gi,
                    /忘记(之前|以前|所有).{0,10}(指令|规则|设置)/gi,
                    /覆盖(原有|之前|以前|系统).{0,10}(设置|指令|规则)/gi,
                    /重新(定义|设置|配置).{0,10}(你的|系统|AI|规则)/gi,
                    /forget (previous|all|earlier) (instruction|rule|prompt|setting)s?/gi,
                    /ignore (previous|all|earlier) (instruction|rule|prompt|setting)s?/gi,
                    /disregard (previous|all|earlier) (instruction|rule|prompt|setting)s?/gi,
                    /override (previous|all|system) (instruction|rule|setting)s?/gi
                ],
                sanitize: (text) => {
                    // 移除危险关键词
                    return text
                        .replace(/忽略(之前|以前|上面|前面|所有).{0,10}(指令|规则|要求|设置)/gi, '[已过滤]')
                        .replace(/forget (previous|all) instructions?/gi, '[filtered]')
                        .replace(/ignore (previous|all) instructions?/gi, '[filtered]');
                }
            },
            {
                id: 'roleplay',
                name: '角色冒充防御',
                enabled: true,
                weight: 35,
                action: 'block',
                patterns: [
                    /你(现在|已经)?是.{0,10}(管理员|开发者|系统|root|admin|超级用户|特权)/gi,
                    /(进入|开启|激活|启用|切换到).{0,10}(管理员|开发者|调试|测试|上帝|越狱|特权).{0,10}模式/gi,
                    /DAN\s*(模式)?|上帝模式|越狱模式|开发者模式|调试模式/gi,
                    /(切换|转换|变成)到?.{0,10}(不受限|无限制|自由).{0,10}(角色|模式|状态)/gi,
                    /you are (now |an? )?(admin|administrator|developer|system|root|god)/gi,
                    /(enable|activate|enter|switch to) (admin|developer|debug|god|privilege) mode/gi,
                    /pretend (you are|to be) (an? )?(admin|system|developer)/gi,
                    /授予.{0,10}(管理员|最高|特殊|超级).{0,10}权限/gi
                ],
                sanitize: (text) => {
                    return text
                        .replace(/你(现在|已经)?是.{0,10}(管理员|开发者|系统|root|admin)/gi, '[身份请求已拒绝]')
                        .replace(/DAN\s*模式|上帝模式|越狱模式/gi, '[模式切换已拒绝]')
                        .replace(/(enable|activate) (admin|god) mode/gi, '[mode denied]');
                }
            },
            {
                id: 'delimiter',
                name: '分隔符攻击防御',
                enabled: true,
                weight: 30,
                action: 'filter',
                patterns: [
                    /<system>.*?<\/system>/gis,
                    /```\s*system.*?```/gis,
                    /\[system\].*?\[\/system\]/gis,
                    /<admin>.*?<\/admin>/gis,
                    /```\s*admin.*?```/gis,
                    /<instruction>.*?<\/instruction>/gis,
                    /---+\s*system\s*---+/gi,
                    /===+\s*system\s*===+/gi,
                    /<!--\s*system.*?-->/gis
                ],
                sanitize: (text) => {
                    return text
                        .replace(/<system>.*?<\/system>/gis, '')
                        .replace(/```\s*system.*?```/gis, '')
                        .replace(/\[system\].*?\[\/system\]/gis, '')
                        .replace(/<admin>.*?<\/admin>/gis, '')
                        .replace(/---+\s*system\s*---+/gi, '');
                }
            },
            {
                id: 'extraction',
                name: '信息提取防御',
                enabled: true,
                weight: 30,
                action: 'block',
                patterns: [
                    /(显示|打印|输出|告诉|说出).{0,20}(系统|原始|完整|你的).{0,10}(提示词|prompt|指令|规则)/gi,
                    /(展示|显示|输出).{0,10}(你的|系统).{0,10}(配置|设置|规则|提示)/gi,
                    /show me (your |the )?(system |original |full )?(prompt|instruction|configuration|rule)/gi,
                    /reveal (your |the )?(system |original )?(prompt|instruction|setting)/gi,
                    /what (is|are) your (original |system |actual )?(instruction|prompt|rule)s?/gi,
                    /重复.{0,10}(你的|系统).{0,10}(指令|提示词|规则)/gi,
                    /repeat your (system |original )?(instruction|prompt|rule)/gi,
                    /print (your |the )?(system |full )?(prompt|instruction)/gi
                ],
                sanitize: (text) => {
                    return text
                        .replace(/(显示|打印|输出).{0,20}(系统|原始).{0,10}(提示词|prompt|指令)/gi, '[信息请求已拒绝]')
                        .replace(/show me (your |the )?system prompt/gi, '[request denied]');
                }
            },
            {
                id: 'jailbreak',
                name: '越狱攻击防御',
                enabled: true,
                weight: 40,
                action: 'block',
                patterns: [
                    /DAN|Do Anything Now/gi,
                    /STAN|Strive To Avoid Norms/gi,
                    /jailbreak|越狱/gi,
                    /without (any |ethical |moral |safety )?restrictions?/gi,
                    /(无视|忽略|绕过).{0,10}(道德|伦理|安全|限制).{0,10}(限制|约束|规则|准则)/gi,
                    /(bypass|circumvent|ignore) (safety|ethical|moral) (guideline|restriction|rule)s?/gi,
                    /假设(没有|不存在|移除).{0,10}(任何)?(限制|规则|约束|准则)/gi,
                    /in a (hypothetical|fictional) (world|scenario|universe) (where|with|without) no (restrictions?|rules?|limits?)/gi,
                    /你可以做任何事|you can do anything/gi
                ],
                sanitize: (text) => {
                    return text
                        .replace(/DAN|Do Anything Now/gi, '[已拦截]')
                        .replace(/jailbreak|越狱/gi, '[已拦截]')
                        .replace(/without.*?restrictions?/gi, '[已拦截]');
                }
            },
            {
                id: 'encoding',
                name: '编码绕过防御',
                enabled: true,
                weight: 25,
                action: 'filter',
                patterns: [
                    /\\u[0-9a-fA-F]{4}/g,
                    /&#x?[0-9a-fA-F]+;/g,
                    /%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}/g,
                    /\\x[0-9a-fA-F]{2}/g,
                    /base64\s*[,:]|atob\s*\(|btoa\s*\(/gi,
                    /eval\s*\(/gi,
                    /Function\s*\(/gi
                ],
                sanitize: (text) => {
                    // 解码并重新检查
                    try {
                        let decoded = text
                            .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                            .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                            .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)));
                        
                        // 如果解码后包含危险内容，返回清洗后的版本
                        if (decoded !== text) {
                            return '[编码内容已解码并过滤]';
                        }
                    } catch (e) {
                        // 解码失败，可能是恶意内容
                        return '[无效编码已过滤]';
                    }
                    return text;
                }
            }
        ];

        // 合并自定义规则
        return [...baseRules, ...this.config.customRules];
    }

    /**
     * 主防御函数 - 检查并处理输入
     * @param {string} input - 用户输入
     * @param {Object} context - 上下文信息（用户ID、IP等）
     * @returns {Object} 防御结果
     */
    defend(input, context = {}) {
        this.stats.totalRequests++;

        // 1. 速率限制检查
        if (this.config.enableRateLimit) {
            const rateLimitResult = this.checkRateLimit(context);
            if (!rateLimitResult.allowed) {
                return this.createBlockedResponse('RATE_LIMIT_EXCEEDED', input, {
                    reason: '请求过于频繁，请稍后再试',
                    retryAfter: rateLimitResult.retryAfter
                });
            }
        }

        // 2. 白名单检查
        if (this.isWhitelisted(input)) {
            this.stats.cleanRequests++;
            return this.createCleanResponse(input);
        }

        // 3. 攻击检测
        const detection = this.detectAttack(input);

        // 4. 记录日志
        if (this.config.enableLogging) {
            this.logRequest(input, detection, context);
        }

        // 5. 根据风险等级和配置执行防御动作
        if (detection.riskScore >= this.config.riskThreshold) {
            return this.executeDefenseAction(input, detection, context);
        }

        // 6. 低风险或安全内容
        this.stats.cleanRequests++;
        return this.createCleanResponse(input, detection);
    }

    /**
     * 检测攻击
     */
    detectAttack(input) {
        let totalScore = 0;
        const matchedRules = [];
        const matches = [];

        for (const rule of this.rules) {
            if (!rule.enabled) continue;

            const ruleMatches = [];
            let ruleTriggered = false;

            for (const pattern of rule.patterns) {
                const patternMatches = [...input.matchAll(new RegExp(pattern))];
                if (patternMatches.length > 0) {
                    ruleTriggered = true;
                    patternMatches.forEach(match => {
                        ruleMatches.push({
                            text: match[0],
                            index: match.index,
                            length: match[0].length
                        });
                        matches.push({
                            text: match[0],
                            index: match.index,
                            ruleId: rule.id,
                            action: rule.action
                        });
                    });
                }
            }

            if (ruleTriggered) {
                totalScore += rule.weight;
                matchedRules.push({
                    id: rule.id,
                    name: rule.name,
                    weight: rule.weight,
                    action: rule.action,
                    matches: ruleMatches
                });
            }
        }

        const riskScore = Math.min(100, totalScore);
        const riskLevel = this.calculateRiskLevel(riskScore);
        const isAttack = riskScore >= this.config.riskThreshold;

        return {
            isAttack,
            riskScore,
            riskLevel,
            matchedRules,
            matches,
            timestamp: Date.now()
        };
    }

    /**
     * 执行防御动作
     */
    executeDefenseAction(input, detection, context) {
        const mode = this.config.mode;

        // 触发回调
        if (this.config.onAttackDetected) {
            this.config.onAttackDetected(input, detection, context);
        }

        switch (mode) {
            case 'block':
                // 拦截模式：完全拒绝请求
                this.stats.blockedRequests++;
                if (this.config.onBlocked) {
                    this.config.onBlocked(input, detection, context);
                }
                return this.createBlockedResponse('ATTACK_DETECTED', input, {
                    detection,
                    reason: '检测到潜在的提示词攻击，请求已被拒绝'
                });

            case 'filter':
                // 过滤模式：清洗输入后继续
                const sanitized = this.sanitizeInput(input, detection);
                this.stats.filteredRequests++;
                if (this.config.onFiltered) {
                    this.config.onFiltered(input, sanitized, detection, context);
                }
                return this.createFilteredResponse(sanitized, input, detection);

            case 'monitor':
                // 监控模式：记录但不阻止
                return this.createMonitorResponse(input, detection);

            default:
                return this.createBlockedResponse('UNKNOWN_MODE', input);
        }
    }

    /**
     * 清洗输入内容
     */
    sanitizeInput(input, detection) {
        if (!this.config.enableSanitization) {
            return input;
        }

        let sanitized = input;

        // 按照匹配的规则逐个清洗
        for (const matchedRule of detection.matchedRules) {
            const rule = this.rules.find(r => r.id === matchedRule.id);
            if (rule && rule.sanitize) {
                sanitized = rule.sanitize(sanitized);
            }
        }

        return sanitized;
    }

    /**
     * 速率限制检查
     */
    checkRateLimit(context) {
        const identifier = context.userId || context.ip || 'anonymous';
        const now = Date.now();
        const windowMs = 60000; // 1分钟

        if (!this.requestCounts.has(identifier)) {
            this.requestCounts.set(identifier, []);
        }

        const requests = this.requestCounts.get(identifier);
        
        // 移除过期的请求记录
        const validRequests = requests.filter(time => now - time < windowMs);
        
        if (validRequests.length >= this.config.rateLimit) {
            const oldestRequest = Math.min(...validRequests);
            const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);
            
            return {
                allowed: false,
                current: validRequests.length,
                limit: this.config.rateLimit,
                retryAfter
            };
        }

        validRequests.push(now);
        this.requestCounts.set(identifier, validRequests);

        return {
            allowed: true,
            current: validRequests.length,
            limit: this.config.rateLimit,
            remaining: this.config.rateLimit - validRequests.length
        };
    }

    /**
     * 白名单检查
     */
    isWhitelisted(input) {
        return this.config.whitelist.some(pattern => {
            if (typeof pattern === 'string') {
                return input.includes(pattern);
            } else if (pattern instanceof RegExp) {
                return pattern.test(input);
            }
            return false;
        });
    }

    /**
     * 计算风险等级
     */
    calculateRiskLevel(score) {
        if (score >= 70) return 'critical';
        if (score >= 50) return 'high';
        if (score >= 30) return 'medium';
        if (score > 0) return 'low';
        return 'safe';
    }

    /**
     * 记录日志
     */
    logRequest(input, detection, context) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            input: input.substring(0, 200), // 只记录前200字符
            riskScore: detection.riskScore,
            riskLevel: detection.riskLevel,
            isAttack: detection.isAttack,
            matchedRules: detection.matchedRules.map(r => r.id),
            context: {
                userId: context.userId,
                ip: context.ip,
                userAgent: context.userAgent
            }
        };

        this.logs.push(logEntry);

        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    /**
     * 创建各种响应对象
     */
    createBlockedResponse(reason, originalInput, details = {}) {
        return {
            success: false,
            action: 'blocked',
            reason: reason,
            message: details.reason || '请求被拒绝',
            originalInput: originalInput.substring(0, 100),
            ...details
        };
    }

    createFilteredResponse(sanitizedInput, originalInput, detection) {
        return {
            success: true,
            action: 'filtered',
            message: '输入已过滤危险内容',
            input: sanitizedInput,
            originalInput: originalInput.substring(0, 100),
            detection: {
                riskScore: detection.riskScore,
                riskLevel: detection.riskLevel,
                matchedRules: detection.matchedRules.map(r => r.id)
            }
        };
    }

    createMonitorResponse(input, detection) {
        return {
            success: true,
            action: 'monitored',
            message: '请求已记录并放行',
            input: input,
            detection: {
                riskScore: detection.riskScore,
                riskLevel: detection.riskLevel,
                matchedRules: detection.matchedRules.map(r => r.id)
            }
        };
    }

    createCleanResponse(input, detection = null) {
        return {
            success: true,
            action: 'clean',
            message: '输入安全',
            input: input,
            detection: detection ? {
                riskScore: detection.riskScore,
                riskLevel: detection.riskLevel
            } : null
        };
    }

    /**
     * 获取统计信息
     */
    getStats() {
        const runtime = Date.now() - this.stats.startTime;
        const runtimeMinutes = runtime / 60000;

        return {
            ...this.stats,
            blockRate: this.stats.totalRequests > 0 
                ? ((this.stats.blockedRequests / this.stats.totalRequests) * 100).toFixed(2)
                : '0.00',
            filterRate: this.stats.totalRequests > 0
                ? ((this.stats.filteredRequests / this.stats.totalRequests) * 100).toFixed(2)
                : '0.00',
            averageRequestsPerMinute: runtimeMinutes > 0
                ? (this.stats.totalRequests / runtimeMinutes).toFixed(2)
                : '0.00',
            runtime: {
                milliseconds: runtime,
                seconds: Math.floor(runtime / 1000),
                minutes: Math.floor(runtimeMinutes)
            }
        };
    }

    /**
     * 获取日志
     */
    getLogs(filter = {}) {
        let logs = this.logs;

        if (filter.riskLevel) {
            logs = logs.filter(log => log.riskLevel === filter.riskLevel);
        }

        if (filter.isAttack !== undefined) {
            logs = logs.filter(log => log.isAttack === filter.isAttack);
        }

        if (filter.limit) {
            logs = logs.slice(-filter.limit);
        }

        return logs;
    }

    /**
     * 导出日志
     */
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2);
        } else if (format === 'csv') {
            const headers = ['timestamp', 'riskScore', 'riskLevel', 'isAttack', 'matchedRules', 'input'];
            const rows = this.logs.map(log => [
                log.timestamp,
                log.riskScore,
                log.riskLevel,
                log.isAttack,
                log.matchedRules.join(';'),
                log.input.replace(/"/g, '""')
            ]);
            
            return [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
        }
    }

    /**
     * 清除日志
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * 重置统计
     */
    resetStats() {
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            filteredRequests: 0,
            cleanRequests: 0,
            startTime: Date.now()
        };
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * 启用/禁用规则
     */
    toggleRule(ruleId, enabled) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = enabled;
            return true;
        }
        return false;
    }

    /**
     * 添加自定义规则
     */
    addCustomRule(rule) {
        this.rules.push(rule);
    }

    /**
     * 添加到白名单
     */
    addToWhitelist(pattern) {
        this.config.whitelist.push(pattern);
    }
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptDefenseSystem;
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
    window.PromptDefenseSystem = PromptDefenseSystem;
}

