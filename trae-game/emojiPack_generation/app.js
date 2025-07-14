document.addEventListener('DOMContentLoaded', () => {
    // 调试面板功能
    const debugPanel = document.getElementById('debug-panel');
    const debugLogs = document.getElementById('debug-logs');
    const toggleDebug = document.getElementById('toggle-debug');

    // 切换调试面板显示
    if (toggleDebug && debugLogs) {
        toggleDebug.addEventListener('click', () => {
            debugLogs.style.display = debugLogs.style.display === 'none' ? 'block' : 'none';
            // 默认显示调试面板
            if(debugLogs.style.display === '') debugLogs.style.display = 'block';
            debugLog('调试面板显示状态: ' + debugLogs.style.display);
        });
    }

    // 自定义日志函数，同时输出到控制台和调试面板
    window.debugLog = function(message, type = 'log') {
        // 输出到控制台
        console[type](message);

        // 输出到调试面板
        if (debugLogs) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${type}`;
            logEntry.innerHTML = `[${timestamp}] ${message}`;
            debugLogs.appendChild(logEntry);
            debugLogs.scrollTop = debugLogs.scrollHeight; // 自动滚动到底部
        }
    };

    debugLog('应用已加载，开始初始化...');
    // DOM元素引用
    const descriptionInput = document.getElementById('descriptionInput');
    const generateBtn = document.getElementById('generateBtn');
    const emojiResult = document.getElementById('emojiResult');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // 表情生成历史记录
    let generationHistory = JSON.parse(localStorage.getItem('emojiHistory')) || [];

    // 初始化历史记录显示
    renderHistory();

    // 验证DOM元素是否存在
    debugLog('DOM元素状态: ' + JSON.stringify({
        generateBtn: !!generateBtn,
        descriptionInput: !!descriptionInput,
        emojiResult: !!emojiResult,
        loadingIndicator: !!loadingIndicator,
        clearHistoryBtn: !!clearHistoryBtn
    }));

    // 生成按钮点击事件
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            console.log('生成按钮被点击');
            showToast('开始生成表情...', 'success');
            generateEmoji();
        });
    } else {
        debugLog('生成按钮元素未找到', 'error');
        showToast('错误: 生成按钮未找到', 'error');
    }

    // 按Enter键也可以生成表情
    if (descriptionInput) {
        descriptionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                debugLog('输入框回车事件触发');
                generateEmoji();
            }
        });
    } else {
        debugLog('输入框元素未找到', 'error');
        showToast('错误: 输入框未找到', 'error');
    }

    // 为清空历史按钮添加点击事件
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
            generationHistory = [];
            localStorage.removeItem('emojiHistory');
            renderHistory();
            showToast('历史记录已清空');
        }
    });

    /**
     * 生成表情图标主函数
     */
    function generateEmoji() {
        try {
            debugLog('generateEmoji函数被调用');
            debugLog('输入框值: ' + descriptionInput.value);
            const description = descriptionInput.value.trim();
            if (!description) {
                debugLog('未输入描述文本，显示提示');
                showToast('请输入表情描述内容', 'error');
                return;
            }

            // 显示加载状态
            showLoading(true);
            debugLog('显示加载状态');

            // 模拟API调用延迟
            setTimeout(() => {
                try {
                    // 详细日志记录生成过程
                    debugLog('[表情生成] 开始处理，描述文本: ' + description);
                debugLog('调用generateEmojiFromDescription前');
                    if (!description.trim()) {
                        throw new Error('请输入有效的表情描述');
                    }

                const result = generateEmojiFromDescription(description);
            debugLog('[表情生成] 原始结果: ' + JSON.stringify(result));
            if (!result) {
                throw new Error('生成器返回空结果');
            }

                // 严格验证结果格式
                if (!result || typeof result !== 'object') {
                    throw new Error('生成器返回无效数据');
                }
                if (!result.type || !['emoji', 'gif'].includes(result.type)) {
                    throw new Error(`不支持的表情类型: ${result.type || '未定义'}`);
                }
                if (!result.value) {
                    throw new Error('表情值不能为空');
                }

                console.log('[表情生成] 验证通过，准备显示:', result);
                displayEmojiResult(result);
                saveToHistory(description, result);
            } catch (error) {
                // 详细错误日志
                debugLog('[表情生成] 错误详情: ' + JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    description: description
                }));
                showToast(`生成失败: ${error.message}`, 'error');
                // 用户友好的错误提示
                emojiResult.innerHTML = `
                    <div class="error-container">
                        <span style="font-size: 2rem;">⚠️</span>
                        <div class="error-message">生成失败</div>
                        <div class="error-details">${error.message}</div>
                        <div class="error-suggestion">请尝试使用不同的描述词或检查网络连接</div>
                    </div>
                `;
            } finally {
                showLoading(false);
                debugLog('隐藏加载状态');
            }
        }, 1500);
    } catch (error) {
        debugLog('generateEmoji函数顶层错误: ' + error.message, 'error');
        showToast('生成表情时发生错误', 'error');
        showLoading(false);
    }
    }

    /**
     * 根据描述生成表情（模拟API）
     * @param {string} description - 表情描述文本
     * @returns {string} 生成的表情符号
     */
    function generateEmojiFromDescription(description) {
        debugLog('[表情生成器] 开始处理描述: ' + description);
        debugLog('[表情生成器] 关键词匹配前');
        // 简单关键词匹配示例，实际项目中可替换为AI API调用
        const lowerDesc = description.toLowerCase();
        const emojiMap = [
            { keywords: ['开心', '高兴', '微笑', '快乐'], type: 'emoji', value: '😊', animated: true },
            { keywords: ['伤心', '难过', '哭', '悲伤'], type: 'emoji', value: '😢', animated: true },
            { keywords: ['生气', '愤怒', '恼火'], type: 'emoji', value: '😠', animated: true },
            { keywords: ['惊讶', '震惊', '哇'], type: 'emoji', value: '😲', animated: true },
            { keywords: ['爱', '喜欢', '心'], type: 'emoji', value: '❤️', animated: true },
            { keywords: ['猫', '猫咪'], type: 'emoji', value: '🐱', animated: true },
            { keywords: ['狗', '小狗'], type: 'emoji', value: '🐶', animated: true },
            { keywords: ['笑', '哈哈', '搞笑'], type: 'emoji', value: '😂', animated: true },
            { keywords: ['酷', '墨镜'], type: 'emoji', value: '😎', animated: true },
            { keywords: ['疑问', '困惑'], type: 'emoji', value: '🤔', animated: true },
            { keywords: ['庆祝', '派对', '节日'], type: 'gif', value: 'celebration.gif' },
            { keywords: ['跳舞', '舞动'], type: 'gif', value: 'dancing.gif' },
            { keywords: ['火箭', '发射', '快速'], type: 'gif', value: 'rocket.gif' },
            { keywords: ['闪电', '速度'], type: 'gif', value: 'lightning.gif' },
        ];

        // 查找匹配的表情
        for (const item of emojiMap) {
            if (item.keywords.some(keyword => lowerDesc.includes(keyword))) {
                return item;
            }
        }

        // 如果没有匹配到，随机返回一个表情
        const randomItems = [
            { type: 'emoji', value: '🤖', animated: false },
            { type: 'emoji', value: '🎨', animated: false },
            { type: 'emoji', value: '✨', animated: true },
            { type: 'emoji', value: '🌟', animated: true },
            { type: 'emoji', value: '🎉', animated: true },
            { type: 'emoji', value: '🤩', animated: false },
            { type: 'emoji', value: '🚀', animated: true },
        ];
        const randomResult = randomItems[Math.floor(Math.random() * randomItems.length)];
        debugLog('[表情生成器] 随机结果: ' + JSON.stringify(randomResult));
        debugLog('[表情生成器] 返回结果前');
        return randomResult;
    }

    /**
     * 显示生成的表情结果
     * @param {string} emoji - 要显示的表情符号
     */
    function displayEmojiResult(result) {
        debugLog('[显示结果] 开始渲染结果: ' + JSON.stringify(result));
        debugLog('[显示结果] 清空现有内容前');
        // 清空现有内容
        emojiResult.innerHTML = '';
        emojiResult.classList.add('has-emoji');

        if (result.type === 'gif') {
            // 处理GIF类型
            const img = document.createElement('img');
            // 使用在线GIF资源作为示例
            const gifUrls = {
                'celebration.gif': 'https://media.tenor.com/images/5a474b5f8d34a6c370718b72f707a5f0/tenor.gif',
                'dancing.gif': 'https://media.tenor.com/images/0e6a19876f8d2a07f8d35d6d0ef88a1c/tenor.gif',
                'rocket.gif': 'https://media.tenor.com/images/2642a24167028a3d4f850d6db8b17e3c/tenor.gif',
                'lightning.gif': 'https://media.tenor.com/images/6229e04b5f93995d370b8e5a5a5b4d6f/tenor.gif'
            };
            img.src = gifUrls[result.value] || 'https://i.giphy.com/media/3o7aDczQfKvC3Pw4GY/giphy.gif';
            img.alt = '生成的GIF表情';
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            // 添加图片加载错误处理
            // 捕获当前结果用于错误处理
            const currentResult = result;
            img.onerror = function() {
                console.error('GIF加载失败，使用默认表情');
                emojiResult.innerHTML = `<span style="font-size: 6rem;">${currentResult.value}</span>`;
            };
            // 添加点击复制功能
            img.addEventListener('click', () => copyToClipboard(result.value));
            // 创建复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋 复制';
            copyBtn.addEventListener('click', () => copyToClipboard(result.value));

            emojiResult.appendChild(img);
            // 将复制按钮添加到标题旁的容器
            const copyContainer = document.getElementById('copy-button-container');
            if (copyContainer) {
                copyContainer.appendChild(copyBtn);
                debugLog('[显示结果] 复制按钮已添加到容器');
            debugLog('[显示结果] 表情渲染完成');
            debugLog('[流程完成] 表情生成和显示流程已完成');
            showToast('表情生成成功', 'success');
            debugLog('[显示结果] GIF渲染完成');
            debugLog('[流程完成] 表情生成和显示流程已完成');
            showToast('GIF表情生成成功', 'success');
            } else {
                debugLog('[显示结果] 复制按钮容器未找到', 'error');
                showToast('错误: 界面元素缺失', 'error');
            }
        } else {
            // 处理普通表情符号，支持CSS动画
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = result.value;
            emojiSpan.style.fontSize = '6rem';
            if (result.animated) {
                emojiSpan.classList.add('animated-emoji');
            }
            // 添加点击复制功能
            emojiSpan.addEventListener('click', () => copyToClipboard(result.value));
            // 创建复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋 复制';
            copyBtn.addEventListener('click', () => copyToClipboard(result.value));

            emojiResult.appendChild(emojiSpan);
            // 将复制按钮添加到标题旁的容器
            const copyContainer = document.getElementById('copy-button-container');
            if (copyContainer) {
                copyContainer.appendChild(copyBtn);
                debugLog('[显示结果] 复制按钮已添加到容器');
            } else {
                debugLog('[显示结果] 复制按钮容器未找到', 'error');
                showToast('错误: 界面元素缺失', 'error');
            }
        }
    }

    /**
     * 显示或隐藏加载指示器
     * @param {boolean} show - 是否显示加载指示器
     */
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
        emojiResult.style.display = show ? 'none' : 'flex';
        generateBtn.disabled = show;
    }

    /**
     * 保存生成记录到历史
     * @param {string} description - 表情描述
     * @param {string} emoji - 生成的表情
     */
    function saveToHistory(description, emoji) {
        const historyItem = {
            id: Date.now(),
            description,
            emoji,
            timestamp: new Date().toLocaleString()
        };

        // 添加到历史记录并限制数量为10条
        generationHistory.unshift(historyItem);
        if (generationHistory.length > 10) {
            generationHistory.pop();
        }

        // 保存到localStorage
        localStorage.setItem('emojiHistory', JSON.stringify(generationHistory));

        // 更新历史记录显示
        renderHistory();
    }

    /**
     * 渲染历史记录列表
     */
    /**
     * 复制内容到剪贴板
     * @param {string} content - 要复制的内容
     */
    function copyToClipboard(content) {
        navigator.clipboard.writeText(content)
            .then(() => showToast('已复制到剪贴板!'))
            .catch(err => {
                console.error('复制失败:', err);
                showToast('复制失败，请手动复制', 'error');
            });
    }

    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success/error)
     */
    function showToast(message, type = 'success') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 显示并自动消失
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }

    /**
     * 渲染历史记录列表
     */
    function renderHistory() {
        // 控制清空按钮状态
        clearHistoryBtn.disabled = generationHistory.length === 0;

        if (generationHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-history">暂无历史记录</p>';
            return;
        }

        historyList.innerHTML = '';
        generationHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-emoji">${item.value}</span>
                <span class="history-text">${item.description}</span>
            `;

            // 点击历史项重新使用该描述
            historyItem.addEventListener('click', () => {
                descriptionInput.value = item.description;
                descriptionInput.focus();
            });

            // 点击表情复制
            const emojiSpan = historyItem.querySelector('.history-emoji');
            emojiSpan.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                copyToClipboard(item.value);
            });

            historyList.appendChild(historyItem);
        });
    }
});