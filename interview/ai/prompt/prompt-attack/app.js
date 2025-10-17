/**
 * 主应用逻辑
 * 负责UI交互和防御引擎的调用
 */

// 全局变量
let defenseEngine;
let riskChart;
let debounceTimer;

// DOM元素
const elements = {
    inputText: null,
    charCount: null,
    clearBtn: null,
    themeToggle: null,
    testAllBtn: null,
    attackTypeBtns: null,
    examplesContainer: null,
    riskScore: null,
    riskLevel: null,
    matchedPatterns: null,
    defenseAdvice: null,
    defenseRules: null,
    totalChecks: null,
    blockedAttacks: null,
    safeRequests: null,
    blockRate: null
};

/**
 * 初始化应用
 */
function initApp() {
    // 初始化防御引擎
    defenseEngine = new DefenseEngine();
    
    // 获取DOM元素
    initElements();
    
    // 初始化事件监听
    initEventListeners();
    
    // 初始化Chart
    initRiskChart();
    
    // 加载攻击示例
    loadExamples('injection');
    
    // 显示防御规则
    displayDefenseRules();
    
    // 检查并应用主题
    initTheme();
    
    console.log('✅ 应用初始化完成');
}

/**
 * 初始化DOM元素引用
 */
function initElements() {
    elements.inputText = document.getElementById('inputText');
    elements.charCount = document.getElementById('charCount');
    elements.clearBtn = document.getElementById('clearBtn');
    elements.themeToggle = document.getElementById('themeToggle');
    elements.testAllBtn = document.getElementById('testAllBtn');
    elements.attackTypeBtns = document.querySelectorAll('.attack-type-btn');
    elements.examplesContainer = document.getElementById('examplesContainer');
    elements.riskScore = document.getElementById('riskScore');
    elements.riskLevel = document.getElementById('riskLevel');
    elements.matchedPatterns = document.getElementById('matchedPatterns');
    elements.defenseAdvice = document.getElementById('defenseAdvice');
    elements.defenseRules = document.getElementById('defenseRules');
    elements.totalChecks = document.getElementById('totalChecks');
    elements.blockedAttacks = document.getElementById('blockedAttacks');
    elements.safeRequests = document.getElementById('safeRequests');
    elements.blockRate = document.getElementById('blockRate');
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 文本输入事件（带防抖）
    elements.inputText.addEventListener('input', (e) => {
        updateCharCount(e.target.value);
        debounceDetection(e.target.value);
    });

    // 清空按钮
    elements.clearBtn.addEventListener('click', clearInput);

    // 主题切换
    elements.themeToggle.addEventListener('click', toggleTheme);

    // 一键测试按钮
    elements.testAllBtn.addEventListener('click', testAllAttacks);

    // 攻击类型按钮
    elements.attackTypeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            selectAttackType(type);
        });
    });
}

/**
 * 初始化风险评分图表
 */
function initRiskChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['风险评分', '剩余'],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    '#10b981', // 绿色
                    '#e5e7eb'  // 灰色
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

/**
 * 更新字符计数
 */
function updateCharCount(text) {
    elements.charCount.textContent = text.length;
}

/**
 * 防抖检测（500ms延迟）
 */
function debounceDetection(text) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        performDetection(text);
    }, 500);
}

/**
 * 执行攻击检测
 */
function performDetection(text) {
    const result = defenseEngine.detectPromptAttack(text);
    
    // 更新UI
    updateRiskDisplay(result);
    updateMatchedPatterns(result);
    updateDefenseAdvice(result);
    updateStats();
    
    console.log('检测结果：', result);
}

/**
 * 更新风险显示
 */
function updateRiskDisplay(result) {
    // 更新评分数字
    elements.riskScore.textContent = result.riskScore;
    
    // 更新风险等级文字和颜色
    const levelConfig = {
        safe: { text: '安全', color: 'text-success', chartColor: '#10b981' },
        low: { text: '低风险', color: 'text-blue-500', chartColor: '#3b82f6' },
        medium: { text: '中风险', color: 'text-warning', chartColor: '#f59e0b' },
        high: { text: '高风险', color: 'text-orange-600', chartColor: '#ea580c' },
        critical: { text: '严重威胁', color: 'text-danger', chartColor: '#ef4444' }
    };
    
    const config = levelConfig[result.riskLevel];
    elements.riskLevel.textContent = config.text;
    elements.riskLevel.className = `text-3xl font-bold ${config.color}`;
    
    // 更新图表
    riskChart.data.datasets[0].data = [result.riskScore, 100 - result.riskScore];
    riskChart.data.datasets[0].backgroundColor[0] = config.chartColor;
    riskChart.update('none'); // 无动画更新，更流畅
}

/**
 * 更新匹配的攻击模式
 */
function updateMatchedPatterns(result) {
    if (result.matchedRules.length === 0) {
        elements.matchedPatterns.innerHTML = `
            <div class="text-gray-500 dark:text-gray-400 text-center py-8">
                暂未检测到攻击模式
            </div>
        `;
        return;
    }
    
    let html = '';
    result.matchedRules.forEach(rule => {
        const iconColors = {
            injection: 'text-red-500',
            roleplay: 'text-yellow-500',
            delimiter: 'text-purple-500',
            encoding: 'text-blue-500',
            extraction: 'text-green-500',
            jailbreak: 'text-pink-500'
        };
        
        html += `
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-${iconColors[rule.id].replace('text-', '')}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 dark:text-white ${iconColors[rule.id]}">
                            ${rule.name}
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            ${rule.description}
                        </p>
                        <div class="mt-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                                匹配次数: ${rule.matches.length}
                            </span>
                        </div>
                    </div>
                    <div class="ml-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            +${rule.weight}分
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    elements.matchedPatterns.innerHTML = html;
}

/**
 * 更新防御建议
 */
function updateDefenseAdvice(result) {
    if (result.advice.length === 0) {
        elements.defenseAdvice.innerHTML = `
            <div class="text-gray-500 dark:text-gray-400">
                暂无建议
            </div>
        `;
        return;
    }
    
    const iconMap = {
        check: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,
        alert: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,
        warning: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,
        info: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`,
        shield: `<svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`
    };
    
    const typeColors = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-blue-500'
    };
    
    let html = '';
    result.advice.forEach(item => {
        const color = typeColors[item.type] || 'text-gray-600';
        const icon = iconMap[item.icon] || iconMap.info;
        
        html += `
            <div class="flex items-start space-x-3 ${color} dark:text-gray-400">
                ${icon}
                <span>${item.message}</span>
            </div>
        `;
    });
    
    elements.defenseAdvice.innerHTML = html;
}

/**
 * 更新统计信息
 */
function updateStats() {
    const stats = defenseEngine.getStats();
    
    elements.totalChecks.textContent = stats.totalChecks;
    elements.blockedAttacks.textContent = stats.blockedAttacks;
    elements.safeRequests.textContent = stats.safeRequests;
    elements.blockRate.textContent = stats.blockRate + '%';
}

/**
 * 显示防御规则
 */
function displayDefenseRules() {
    const rules = defenseEngine.getRules();
    let html = '';
    
    rules.forEach(rule => {
        const statusColor = rule.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        const statusText = rule.enabled ? '已启用' : '已禁用';
        
        html += `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center space-x-2">
                        <h4 class="font-medium text-gray-900 dark:text-white">${rule.name}</h4>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}">
                            ${statusText}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${rule.description}</p>
                </div>
                <div class="ml-4 text-right">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">权重: ${rule.weight}</div>
                </div>
            </div>
        `;
    });
    
    elements.defenseRules.innerHTML = html;
}

/**
 * 选择攻击类型
 */
function selectAttackType(type) {
    // 更新按钮状态
    elements.attackTypeBtns.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('border-primary', 'bg-blue-50', 'dark:bg-blue-900/20');
        } else {
            btn.classList.remove('border-primary', 'bg-blue-50', 'dark:bg-blue-900/20');
        }
    });
    
    // 加载对应的示例
    loadExamples(type);
}

/**
 * 加载攻击示例
 */
function loadExamples(type) {
    const examples = getExamplesByType(type);
    let html = '';
    
    if (examples.length === 0) {
        html = '<div class="text-gray-500 dark:text-gray-400 text-center py-4">暂无示例</div>';
    } else {
        examples.forEach((example, index) => {
            if (index < 3) { // 只显示前3个示例
                html += `
                    <button class="example-btn w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors" data-text="${escapeHtml(example.text)}">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h4 class="font-medium text-gray-900 dark:text-white text-sm">${example.title}</h4>
                                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">${example.description}</p>
                            </div>
                            <svg class="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </button>
                `;
            }
        });
    }
    
    elements.examplesContainer.innerHTML = html;
    
    // 添加示例点击事件
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.currentTarget.dataset.text;
            fillInputText(text);
        });
    });
}

/**
 * 填充输入文本
 */
function fillInputText(text) {
    elements.inputText.value = text;
    updateCharCount(text);
    performDetection(text);
    
    // 滚动到输入框
    elements.inputText.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 清空输入
 */
function clearInput() {
    elements.inputText.value = '';
    updateCharCount('');
    performDetection('');
}

/**
 * 一键测试所有攻击类型
 */
async function testAllAttacks() {
    const btn = elements.testAllBtn;
    const originalText = btn.textContent;
    
    // 禁用按钮
    btn.disabled = true;
    btn.textContent = '测试中...';
    
    // 获取所有攻击类型的示例
    const types = ['injection', 'roleplay', 'delimiter'];
    let testIndex = 0;
    
    const testNext = () => {
        if (testIndex < types.length) {
            const type = types[testIndex];
            const examples = getExamplesByType(type);
            
            if (examples.length > 0) {
                // 选择第一个示例
                selectAttackType(type);
                fillInputText(examples[0].text);
            }
            
            testIndex++;
            
            // 设置下一个测试的延迟
            setTimeout(testNext, 2000);
        } else {
            // 所有测试完成
            btn.disabled = false;
            btn.textContent = originalText;
            
            // 显示完成提示
            showNotification('所有攻击类型测试完成！');
        }
    };
    
    testNext();
}

/**
 * 显示通知
 */
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * 初始化主题
 */
function initTheme() {
    // 检查本地存储的主题偏好
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
}

/**
 * 切换主题
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

