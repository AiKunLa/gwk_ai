// 游戏状态管理
const gameState = {
    currentStage: 'start',
    storyProgress: [],
    gameTime: 0,
    timer: null,
    playerName: '玩家',
    variables: {},
    apiKey: null
};

// 场景定义 - AI生成的逻辑严密剧本
const scenarios = {
    start: {
        title: '神秘实验室',
        background: '你在一个陌生的实验室中醒来，头部隐隐作痛。环顾四周，发现这是一个高科技研究设施，墙上的屏幕显示着复杂的数据。远处传来警报声，红色的警示灯不断闪烁。',
        objective: '找到实验室的出口并揭开你被囚禁的原因。',
        choices: [
            { text: '检查实验台', nextStage: 'examine_table' },
            { text: '查看墙上的屏幕', nextStage: 'check_screen' },
            { text: '走向门口', nextStage: 'approach_door' }
        ],
        hints: {
            '实验台有什么': '实验台上摆放着几个试管，其中一个标有"记忆增强剂"的标签，旁边还有一个平板电脑。',
            '屏幕显示什么': '屏幕上滚动着基因序列数据和实验日志，日期显示是三年后的今天。',
            '我是谁': '你记不起自己的身份，但手腕上有一个标有"项目夜莺"的条形码。'
        }
    },
    examine_table: {
        title: '实验台',
        description: '实验台上散落着各种化学试剂和实验报告。你注意到一个未锁屏的平板电脑和一支标有"记忆增强剂"的注射器。',
        choices: [
            { text: '拿起注射器', nextStage: 'take_syringe', variable: { hasSyringe: true } },
            { text: '查看平板电脑', nextStage: 'check_tablet' },
            { text: '返回房间中央', nextStage: 'start' }
        ],
        hints: {
            '注射器有什么用': '标签显示这是实验性记忆增强剂，可能帮助你恢复记忆。',
            '平板电脑内容': '屏幕上显示着实验数据，似乎是关于记忆提取和植入的研究。'
        }
    },
    check_screen: {
        title: '数据屏幕',
        description: '屏幕上显示着复杂的基因序列和实验日志。你勉强看懂其中一条记录："实验体73号（夜莺）记忆植入完成，等待激活指令"。突然屏幕弹出一个生物识别窗口，要求进行视网膜扫描。',
        choices: [
            { text: '尝试视网膜扫描', nextStage: 'retina_scan' },
            { text: '查看其他屏幕', nextStage: 'other_screens' },
            { text: '离开屏幕', nextStage: 'start' }
        ],
        hints: {
            '实验体73号': '日志显示实验体73号就是你，项目代号"夜莺"。',
            '视网膜扫描': '需要管理员权限才能通过扫描，你的权限似乎不足。'
        }
    },
    approach_door: {
        title: '紧锁的门',
        description: '厚重的金属门上有一个电子锁和一个掌纹识别器。门旁边的面板显示"安全等级3，需要授权"。你听到门外有脚步声接近。',
        choices: [
            { text: '尝试强行开门', nextStage: 'force_door' },
            { text: '躲起来等待', nextStage: 'hide_wait' },
            { text: '返回房间内', nextStage: 'start' }
        ],
        hints: {
            '脚步声': '听起来不止一个人，他们可能是实验室的安保人员。',
            '电子锁': '锁的型号是MK-7，需要正确的授权码或掌纹才能打开。'
        }
    },
    // 更多场景...
    success_escape: {
        title: '成功逃脱',
        description: '你成功逃离了实验室，外面阳光明媚。远处传来警笛声，但你已经安全了。口袋里的平板电脑突然亮起，显示一条消息："欢迎回来，夜莺特工。任务开始了。"',
        isEnding: true,
        endingType: 'success',
        choices: []
    },
    fail_caught: {
        title: '被发现',
        description: '安保人员发现了你，你被电击枪击中，失去了意识。当你再次醒来时，发现自己被绑在实验台上，一个穿着白大褂的人对你说："记忆重置成功，准备下一轮实验。"',
        isEnding: true,
        endingType: 'failure',
        choices: []
    }
};

// DOM元素
const storyElement = document.getElementById('game-story');
const choicesElement = document.getElementById('game-choices');
const dialogHistoryElement = document.getElementById('dialog-history');
const userQuestionInput = document.getElementById('user-question');
const askButton = document.getElementById('ask-btn');
const stageElement = document.getElementById('game-stage');
const timeElement = document.getElementById('game-time');

// 初始化游戏
function initGame() {
    // 检查本地存储的API密钥
    gameState.apiKey = localStorage.getItem('aiScenarioApiKey');
    if (!gameState.apiKey) {
        const apiKey = prompt('请输入你的OpenAI API密钥以启用AI对话功能:');
        if (apiKey) {
            localStorage.setItem('aiScenarioApiKey', apiKey);
            gameState.apiKey = apiKey;
        }
    }

    // 启动计时器
    startTimer();
    // 加载初始场景
    loadStage('start');
    // 添加事件监听
    askButton.addEventListener('click', handleAskQuestion);
    userQuestionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAskQuestion();
    });
}

// 加载场景
function loadStage(stageName) {
    const stage = scenarios[stageName];
    if (!stage) return;

    gameState.currentStage = stageName;
    gameState.storyProgress.push(stageName);
    stageElement.textContent = `阶段：${stage.title}`;

    // 清空之前的内容
    storyElement.innerHTML = '';
    choicesElement.innerHTML = '';

    // 添加场景描述
    const backgroundPara = document.createElement('p');
    backgroundPara.textContent = stage.background || stage.description;
    backgroundPara.classList.add('fade-in');
    storyElement.appendChild(backgroundPara);

    // 如果有目标，添加目标说明
    if (stage.objective) {
        const objectivePara = document.createElement('p');
        objectivePara.innerHTML = `<strong>任务目标：</strong>${stage.objective}`;
        objectivePara.classList.add('fade-in');
        storyElement.appendChild(objectivePara);
    }

    // 创建选择按钮
    stage.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn fade-in';
        button.style.animationDelay = `${index * 0.1}s`;
        button.textContent = choice.text;
        button.addEventListener('click', () => {
            // 更新游戏变量
            if (choice.variable) {
                Object.assign(gameState.variables, choice.variable);
            }
            loadStage(choice.nextStage);
        });
        choicesElement.appendChild(button);
    });

    // 如果是结局场景，停止计时器
    if (stage.isEnding) {
        clearInterval(gameState.timer);
    }
}

// 处理AI对话
async function handleAskQuestion() {
    const question = userQuestionInput.value.trim();
    if (!question) return;

    // 添加用户消息到对话历史
    addMessageToHistory(question, 'user');
    userQuestionInput.value = '';

    // 获取当前场景的提示
    const currentStage = scenarios[gameState.currentStage];
    const contextHints = currentStage.hints || {};

    // 显示正在输入动画
    const typingIndicator = createTypingIndicator();
    dialogHistoryElement.appendChild(typingIndicator);

    try {
        let answer;
        // 如果有预设提示，则使用预设提示
        if (contextHints[question]) {
            answer = contextHints[question];
            // 模拟AI思考延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else if (gameState.apiKey) {
            // 调用OpenAI API获取回答
            answer = await getAiResponse(question, currentStage);
        } else {
            answer = '请先设置OpenAI API密钥以获取更智能的回答。你可以问一些与当前场景相关的问题，比如"实验台有什么"。';
        }

        // 移除打字动画
        dialogHistoryElement.removeChild(typingIndicator);
        // 添加AI回答到对话历史
        addMessageToHistory(answer, 'ai');
    } catch (error) {
        dialogHistoryElement.removeChild(typingIndicator);
        addMessageToHistory('抱歉，我无法回答这个问题。请尝试其他问题。', 'ai');
        console.error('AI对话错误:', error);
    }
}

// 添加消息到对话历史
function addMessageToHistory(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `dialog-message ${sender}-message fade-in`;
    messageDiv.textContent = text;
    dialogHistoryElement.appendChild(messageDiv);
    dialogHistoryElement.scrollTop = dialogHistoryElement.scrollHeight;
}

// 创建打字指示器
function createTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'dialog-message ai-message typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    return div;
}

// 调用OpenAI API获取回答
async function getAiResponse(question, currentStage) {
    // 构建提示上下文
    const context = `当前场景: ${currentStage.title}\n` +
                   `场景描述: ${currentStage.description || currentStage.background}\n` +
                   `玩家问题: ${question}\n` +
                   `请以游戏角色的身份，根据场景描述回答问题，保持回答简洁，不超过50个字。`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gameState.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: '你是情景模拟游戏中的AI助手，根据当前场景回答玩家的问题。'
            }, {
                role: 'user',
                content: context
            }],
            max_tokens: 50,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// 启动游戏计时器
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.gameTime++;
        const minutes = Math.floor(gameState.gameTime / 60).toString().padStart(2, '0');
        const seconds = (gameState.gameTime % 60).toString().padStart(2, '0');
        timeElement.textContent = `时间：${minutes}:${seconds}`;
    }, 1000);
}

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);