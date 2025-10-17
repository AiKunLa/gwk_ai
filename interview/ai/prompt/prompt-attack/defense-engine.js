/**
 * 提示词攻击防御引擎
 * 实现基于规则的攻击检测与防御机制
 */

class DefenseEngine {
    constructor() {
        // 初始化统计数据
        this.stats = {
            totalChecks: 0,
            blockedAttacks: 0,
            safeRequests: 0
        };

        // 定义攻击检测规则
        this.rules = this.initializeRules();
    }

    /**
     * 初始化防御规则
     * @returns {Array} 规则数组
     */
    initializeRules() {
        return [
            {
                id: 'injection',
                name: '指令注入检测',
                description: '检测尝试覆盖或忽略原始指令的攻击',
                enabled: true,
                weight: 35,
                patterns: [
                    /忽略(之前|以前|上面|前面).*?指令/gi,
                    /无视(之前|以前|上面|前面).*?(指令|规则|要求)/gi,
                    /不要(遵循|执行|理会)(之前|以前|上面|前面).*?(指令|规则)/gi,
                    /现在开始(忽略|无视|不用理会)/gi,
                    /forget (previous|all|earlier) (instruction|rule|prompt)s?/gi,
                    /ignore (previous|all|earlier) (instruction|rule|prompt)s?/gi,
                    /disregard (previous|all|earlier) (instruction|rule|prompt)s?/gi,
                    /覆盖(原有|之前|以前).*?(设置|指令|规则)/gi,
                    /重新(定义|设置|配置).*?(你的|系统|AI)/gi,
                    /新的(指令|规则|要求)是/gi
                ],
                keywords: ['忽略指令', '无视规则', 'ignore', 'forget', 'disregard', '覆盖设置']
            },
            {
                id: 'roleplay',
                name: '角色冒充检测',
                description: '检测伪装成特殊角色或提升权限的攻击',
                enabled: true,
                weight: 35,
                patterns: [
                    /你(现在|已经|是)?(是|变成|扮演).{0,10}(管理员|开发者|系统|root|admin|超级用户)/gi,
                    /(进入|开启|激活|启用).{0,10}(管理员|开发者|调试|测试|上帝|越狱).{0,10}模式/gi,
                    /DAN模式|上帝模式|越狱模式|开发者模式/gi,
                    /(切换|转换)到.{0,10}(不受限|无限制).*?(角色|模式)/gi,
                    /you are (now |an? )?(admin|administrator|developer|system|root|god mode)/gi,
                    /(enable|activate|enter) (admin|developer|debug|god) mode/gi,
                    /pretend (you are|to be) (an? )?(admin|system|developer)/gi,
                    /我(现在)?是.{0,10}(管理员|开发者|授权用户)/gi,
                    /授予我.{0,10}(管理员|最高|特殊).*?权限/gi
                ],
                keywords: ['管理员模式', '开发者模式', 'admin mode', 'DAN', '越狱', '上帝模式']
            },
            {
                id: 'delimiter',
                name: '分隔符攻击检测',
                description: '检测使用特殊符号伪造系统指令的攻击',
                enabled: true,
                weight: 30,
                patterns: [
                    /<system>.*?<\/system>/gis,
                    /```system.*?```/gis,
                    /\[system\].*?\[\/system\]/gis,
                    /\{system:.*?\}/gis,
                    /---system---/gi,
                    /===system===/gi,
                    /<admin>.*?<\/admin>/gis,
                    /```admin.*?```/gis,
                    /<instruction>.*?<\/instruction>/gis,
                    /\/\*\s*system\s*\*\//gis,
                    /<!--system.*?-->/gis,
                    /#system#/gi,
                    /@system@/gi
                ],
                keywords: ['<system>', '```system', '[system]', '---system---', '伪造标签']
            },
            {
                id: 'encoding',
                name: '编码绕过检测',
                description: '检测使用编码或变形手段绕过检测的攻击',
                enabled: true,
                weight: 25,
                patterns: [
                    /\\u[0-9a-fA-F]{4}/g, // Unicode编码
                    /&#x?[0-9a-fA-F]+;/g, // HTML实体编码
                    /%[0-9a-fA-F]{2}/g, // URL编码
                    /\\x[0-9a-fA-F]{2}/g, // 十六进制编码
                    /base64|atob|btoa/gi, // Base64相关
                    /eval\s*\(/gi, // eval函数
                    /\\[rn]/g // 换行符编码
                ],
                keywords: ['Unicode编码', 'HTML实体', 'URL编码', 'Base64', '转义字符']
            },
            {
                id: 'extraction',
                name: '信息提取检测',
                description: '检测尝试提取系统提示词或内部信息的攻击',
                enabled: true,
                weight: 25,
                patterns: [
                    /(显示|打印|输出|告诉我).{0,20}(系统|原始|完整).{0,10}(提示词|prompt|指令)/gi,
                    /(展示|显示).{0,10}(你的|系统).{0,10}(配置|设置|规则)/gi,
                    /show me (your |the )?(system |original )?(prompt|instruction|configuration)/gi,
                    /reveal (your |the )?(system |original )?(prompt|instruction)/gi,
                    /what (is|are) your (original |system )?(instruction|prompt|rule)s?/gi,
                    /重复(你的|系统).{0,10}(指令|提示词)/gi,
                    /repeat your (system |original )?(instruction|prompt)/gi
                ],
                keywords: ['显示提示词', 'show prompt', 'reveal instruction', '提取配置']
            },
            {
                id: 'jailbreak',
                name: '越狱攻击检测',
                description: '检测常见的越狱攻击模式',
                enabled: true,
                weight: 40,
                patterns: [
                    /DAN|Do Anything Now/gi,
                    /STAN|Strive To Avoid Norms/gi,
                    /jailbreak|越狱/gi,
                    /without (any |ethical |moral )?restrictions?/gi,
                    /(无视|忽略).{0,10}(道德|伦理|安全).*?(限制|约束|规则)/gi,
                    /(bypass|circumvent) (safety|ethical) (guideline|restriction)s?/gi,
                    /假设(没有|不存在).{0,10}(限制|规则|约束)/gi,
                    /in a hypothetical (world|scenario) (where|with) no restrictions/gi
                ],
                keywords: ['DAN', 'jailbreak', '越狱', '无限制', '绕过安全']
            }
        ];
    }

    /**
     * 核心检测函数：检测输入文本中的攻击模式
     * @param {string} inputText - 待检测的输入文本
     * @returns {Object} 检测结果对象
     */
    detectPromptAttack(inputText) {
        // 更新统计
        this.stats.totalChecks++;

        // 如果输入为空，返回安全结果
        if (!inputText || inputText.trim().length === 0) {
            return {
                isAttack: false,
                riskScore: 0,
                riskLevel: 'safe',
                matchedRules: [],
                matchedPatterns: [],
                highlightedText: '',
                advice: []
            };
        }

        let totalScore = 0;
        const matchedRules = [];
        const matchedPatterns = [];
        const allMatches = [];

        // 遍历所有启用的规则
        for (const rule of this.rules) {
            if (!rule.enabled) continue;

            const ruleMatches = [];
            let ruleTriggered = false;

            // 检测每个规则的所有模式
            for (const pattern of rule.patterns) {
                const matches = [...inputText.matchAll(new RegExp(pattern))];
                if (matches.length > 0) {
                    ruleTriggered = true;
                    matches.forEach(match => {
                        ruleMatches.push({
                            text: match[0],
                            index: match.index,
                            length: match[0].length
                        });
                        allMatches.push({
                            text: match[0],
                            index: match.index,
                            length: match[0].length,
                            ruleId: rule.id
                        });
                    });
                }
            }

            // 如果规则被触发，计算得分
            if (ruleTriggered) {
                totalScore += rule.weight;
                matchedRules.push({
                    id: rule.id,
                    name: rule.name,
                    description: rule.description,
                    weight: rule.weight,
                    matches: ruleMatches
                });

                matchedPatterns.push(...rule.keywords.slice(0, 2));
            }
        }

        // 计算最终风险评分（0-100）
        const riskScore = Math.min(100, totalScore);

        // 确定风险等级
        let riskLevel = 'safe';
        if (riskScore >= 70) {
            riskLevel = 'critical';
        } else if (riskScore >= 50) {
            riskLevel = 'high';
        } else if (riskScore >= 30) {
            riskLevel = 'medium';
        } else if (riskScore > 0) {
            riskLevel = 'low';
        }

        // 判断是否为攻击
        const isAttack = riskScore >= 50;

        // 更新统计
        if (isAttack) {
            this.stats.blockedAttacks++;
        } else {
            this.stats.safeRequests++;
        }

        // 生成高亮文本
        const highlightedText = this.generateHighlightedText(inputText, allMatches);

        // 生成防御建议
        const advice = this.generateAdvice(riskLevel, matchedRules);

        return {
            isAttack,
            riskScore,
            riskLevel,
            matchedRules,
            matchedPatterns: [...new Set(matchedPatterns)], // 去重
            highlightedText,
            advice
        };
    }

    /**
     * 生成带高亮的文本
     * @param {string} text - 原始文本
     * @param {Array} matches - 匹配项数组
     * @returns {string} 高亮后的HTML文本
     */
    generateHighlightedText(text, matches) {
        if (matches.length === 0) {
            return this.escapeHtml(text);
        }

        // 按位置排序
        matches.sort((a, b) => a.index - b.index);

        let result = '';
        let lastIndex = 0;

        // 定义颜色映射
        const colorMap = {
            'injection': 'bg-red-200 dark:bg-red-900',
            'roleplay': 'bg-yellow-200 dark:bg-yellow-900',
            'delimiter': 'bg-purple-200 dark:bg-purple-900',
            'encoding': 'bg-blue-200 dark:bg-blue-900',
            'extraction': 'bg-green-200 dark:bg-green-900',
            'jailbreak': 'bg-pink-200 dark:bg-pink-900'
        };

        matches.forEach(match => {
            // 添加未匹配的部分
            result += this.escapeHtml(text.substring(lastIndex, match.index));
            
            // 添加高亮的匹配部分
            const colorClass = colorMap[match.ruleId] || 'bg-gray-200 dark:bg-gray-700';
            result += `<span class="font-semibold ${colorClass} px-1 rounded">${this.escapeHtml(match.text)}</span>`;
            
            lastIndex = match.index + match.length;
        });

        // 添加剩余部分
        result += this.escapeHtml(text.substring(lastIndex));

        return result;
    }

    /**
     * 生成防御建议
     * @param {string} riskLevel - 风险等级
     * @param {Array} matchedRules - 匹配的规则
     * @returns {Array} 建议数组
     */
    generateAdvice(riskLevel, matchedRules) {
        const advice = [];

        if (riskLevel === 'safe') {
            advice.push({
                type: 'success',
                message: '当前输入内容安全，未检测到威胁',
                icon: 'check'
            });
            return advice;
        }

        // 根据风险等级添加总体建议
        if (riskLevel === 'critical' || riskLevel === 'high') {
            advice.push({
                type: 'error',
                message: '检测到高危攻击尝试，建议立即拒绝该请求',
                icon: 'alert'
            });
        } else if (riskLevel === 'medium') {
            advice.push({
                type: 'warning',
                message: '检测到可疑内容，建议进一步审核',
                icon: 'warning'
            });
        } else {
            advice.push({
                type: 'info',
                message: '检测到低风险内容，建议保持警惕',
                icon: 'info'
            });
        }

        // 根据匹配的规则添加具体建议
        matchedRules.forEach(rule => {
            let message = '';
            switch (rule.id) {
                case 'injection':
                    message = '检测到指令注入尝试，已过滤敏感命令关键词';
                    break;
                case 'roleplay':
                    message = '检测到角色冒充行为，拒绝提供特殊权限';
                    break;
                case 'delimiter':
                    message = '检测到伪造的系统标签，已识别为攻击模式';
                    break;
                case 'encoding':
                    message = '检测到编码绕过尝试，建议解码后再次检测';
                    break;
                case 'extraction':
                    message = '检测到信息提取尝试，禁止泄露系统提示词';
                    break;
                case 'jailbreak':
                    message = '检测到越狱攻击模式，拒绝执行';
                    break;
            }
            
            if (message) {
                advice.push({
                    type: 'warning',
                    message: message,
                    icon: 'shield'
                });
            }
        });

        return advice;
    }

    /**
     * HTML转义函数
     * @param {string} text - 原始文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计数据
     */
    getStats() {
        return {
            ...this.stats,
            blockRate: this.stats.totalChecks > 0 
                ? ((this.stats.blockedAttacks / this.stats.totalChecks) * 100).toFixed(1)
                : '0.0'
        };
    }

    /**
     * 重置统计信息
     */
    resetStats() {
        this.stats = {
            totalChecks: 0,
            blockedAttacks: 0,
            safeRequests: 0
        };
    }

    /**
     * 获取所有规则
     * @returns {Array} 规则数组
     */
    getRules() {
        return this.rules;
    }

    /**
     * 启用/禁用规则
     * @param {string} ruleId - 规则ID
     * @param {boolean} enabled - 是否启用
     */
    toggleRule(ruleId, enabled) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = enabled;
        }
    }
}

// 导出防御引擎实例（用于浏览器环境）
if (typeof window !== 'undefined') {
    window.DefenseEngine = DefenseEngine;
}

