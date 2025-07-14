// 游戏状态管理
const gameState = {
  currentScene: "neural_lab",
  inventory: [],
  dataFragments: 0,
  hasHackedTerminal: false,
  hasUsedStims: false,
  gameTime: 0,
  gameOver: false,
  结局: null,
};

// 场景定义
const scenes = {
  neural_lab: {
    name: "神经接入实验室",
    description: `\n你在一个充满赛博朋克风格的实验室中醒来。冰冷的金属地板反射着天花板上闪烁的霓虹灯管，空气中弥漫着臭氧和消毒水的刺鼻气味。\n\n四周环境：\n- 正前方是一扇厚重的合金门，电子锁显示红色，旁边有一个视网膜扫描仪\n- 左侧靠墙放着一台老旧的终端机，屏幕闪烁着杂乱的代码\n- 右侧有一个金属实验台，上面散落着几根用过的神经刺激针和一个空药瓶\n- 墙角的通风管道格栅看起来有些松动\n- 你的手腕上戴着一个神经接口手环，显示着乱码\n\n突然，手环发出刺耳的蜂鸣声，投射出一行全息文字："警告：数据核心锁定，1小时后系统将自毁"`,
    actions: [
      "检查终端机",
      "查看实验台",
      "检查通风管道",
      "尝试打开合金门",
      "检查神经手环",
    ],
    hiddenClues: {
      敲击终端机:
        '你轻轻敲击终端机外壳，听到内部传来轻微的零件松动声。屏幕角落闪过一行小字："维护密码位于物理接口下方"',
      闻药瓶: "药瓶里残留着淡淡的杏仁味，这是军用级神经刺激剂的特征",
    },
    transitions: {
      检查终端机: () => {
        if (gameState.hasHackedTerminal) {
          return "终端机已经被破解，显示着服务器机房的地图。你注意到地图上有三个标红的数据节点。";
        } else {
          showMessage(
            '终端机需要密码才能访问。屏幕上显示着提示："我的诞生年份，加上我女儿的年龄"'
          );
          return "neural_lab";
        }
      },
      查看实验台: () => {
        if (!gameState.inventory.includes("神经刺激针")) {
          gameState.inventory.push("神经刺激针");
          showMessage(
            "你在实验台上找到了一根未使用的神经刺激针，看起来还能正常使用。"
          );
          updateInventory();
        } else {
          showMessage(
            "实验台上除了空药瓶和用过的针头外，没有其他有用的东西了。"
          );
        }
        return "neural_lab";
      },
      检查通风管道: () => {
        showMessage(
          "通风管道的格栅有些松动，但你的身体太大无法直接通过。也许需要工具才能拆下来？"
        );
        return "neural_lab";
      },
      尝试打开合金门: () => {
        showMessage(
          "合金门纹丝不动，电子锁发出拒绝的蜂鸣声。视网膜扫描仪的红灯不断闪烁。"
        );
        return "neural_lab";
      },
      检查神经手环: () => {
        showMessage(
          "神经手环似乎与你的神经系统连接在一起，无法取下。屏幕上的乱码偶尔会变成清晰的倒计时：59:45"
        );
        return "neural_lab";
      },
    },
  },
  server_room: {
    name: "服务器机房",
    description: `\n你进入了一个巨大的服务器机房。数十个服务器机柜排列整齐，发出低沉的嗡鸣。蓝色的指示灯如同呼吸般闪烁，照亮了布满线缆的天花板。\n\n环境元素：\n- 中央控制台显示着三个锁定的数据节点\n- 右侧机柜有一个闪烁的红色警报灯\n- 地面上有一滩液体，散发着刺鼻的化学气味\n- 墙上的应急箱玻璃破碎\n- 角落里有一个通风口，似乎通向其他区域`,
    actions: [
      "检查中央控制台",
      "查看警报灯",
      "检查应急箱",
      "调查液体",
      "查看通风口",
    ],
    hiddenClues: {
      数服务器: "你数了数服务器机柜，总共有17个。这个数字似乎在哪里见过...",
      触摸液体: "液体非常粘稠，沾在手指上发出微弱的蓝光",
      检查线缆:
        '你仔细检查了天花板上的线缆，发现有一组红色线缆被标记为"紧急切断"',
    },
    transitions: {
      检查中央控制台: () => {
        showMessage(
          '中央控制台上有三个数据节点，每个都需要不同的密码才能解锁。屏幕显示提示：\n1. 第一个节点："公司成立年份 - 创始人幸运数字"\n2. 第二个节点："π的前四位小数（不含小数点）"\n3. 第三个节点："实验室中服务器的数量"'
        );
        return "server_room";
      },
      查看警报灯: () => {
        showMessage(
          '红色警报灯来自37号机柜，上面显示"温度过高 - 自动锁定"。机柜门上有一个数字密码锁。'
        );
        return "server_room";
      },
      检查应急箱: () => {
        if (!gameState.inventory.includes("断线钳")) {
          gameState.inventory.push("断线钳");
          showMessage("你在应急箱里找到了一把断线钳。");
          updateInventory();
        } else {
          showMessage("应急箱里空空如也。");
        }
        return "server_room";
      },
      调查液体: () => {
        showMessage(
          "这是一种冷却剂泄漏，如果你有容器的话或许可以收集一些。但直接触摸可能会导致化学灼伤。"
        );
        return "server_room";
      },
      查看通风口: () => {
        if (gameState.inventory.includes("断线钳")) {
          showMessage(
            "你用断线钳剪开了通风口的栅栏，发现里面有一条狭窄的通道。"
          );
          return "ventilation_shaft";
        } else {
          showMessage("通风口的栅栏很坚固，你需要工具才能打开它。");
          return "server_room";
        }
      },
    },
  },
  ventilation_shaft: {
    name: "通风管道",
    description: `\n你挤入狭窄的通风管道，四周都是冰冷的金属和灰尘。管道内每隔一段距离就有一个格栅，可以看到下方不同的房间。\n\n环境元素：\n- 前方有一个岔路口，向左和向右两个方向\n- 脚下的格栅可以移开，下方是一间办公室\n- 管道壁上有一些生锈的螺丝和松动的金属片\n- 远处传来保安巡逻的脚步声\n- 你的神经手环发出微弱的信号干扰`,
    actions: ["向左转", "向右转", "检查脚下格栅", "听脚步声", "修复手环信号"],
    hiddenClues: {
      检查螺丝: "这些螺丝的型号很特殊，需要专用工具才能拧开",
      闻空气: "左边通道传来淡淡的咖啡味，右边则有臭氧的气味",
    },
    transitions: {
      向左转: () => {
        showMessage(
          "你选择了左侧通道，爬了大约50米后，前方被一堆废弃的线缆堵住了去路。"
        );
        return "ventilation_shaft";
      },
      向右转: () => {
        showMessage("你选择了右侧通道，爬了几分钟后，发现前方有光亮。");
        return "data_core";
      },
      检查脚下格栅: () => {
        showMessage(
          '格栅下方是一间办公室，桌上有一张员工ID卡和一份标有"绝密"的文件。但格栅被螺丝固定住了。'
        );
        return "ventilation_shaft";
      },
      听脚步声: () => {
        showMessage(
          '脚步声越来越近，似乎停在了服务器机房门口。你听到对话声："...那个数据幽灵还没找到吗？老板说不惜一切代价要抓住他..."'
        );
        return "ventilation_shaft";
      },
      修复手环信号: () => {
        if (gameState.inventory.includes("神经刺激针")) {
          showMessage(
            "你将神经刺激针的针头取下，用作简易天线，手环信号恢复了一些。现在可以看到更清晰的地图。"
          );
          gameState.inventory = gameState.inventory.filter(
            (item) => item !== "神经刺激针"
          );
          gameState.inventory.push("自制天线");
          updateInventory();
        } else {
          showMessage("你没有任何工具可以修复信号干扰。");
        }
        return "ventilation_shaft";
      },
    },
  },
  data_core: {
    name: "数据核心室",
    description: `\n你从通风管道爬出，进入了一个圆形房间。房间中央是一个巨大的球形数据核心，无数光线在其中流动，如同人造星系。\n\n环境元素：\n- 数据核心周围有三个控制台，分别标有A、B、C\n- 墙上的屏幕显示着复杂的数据流程图\n- 房间中央有一个平台，似乎是放置物品的地方\n- 门是厚重的金属门，上面有一个生物识别 scanner\n- 天花板上的摄像头正在缓慢旋转`,
    actions: [
      "操作控制台A",
      "操作控制台B",
      "操作控制台C",
      "检查数据核心",
      "躲避摄像头",
    ],
    hiddenClues: {
      分析数据流: "你注意到数据流动的模式似乎与某种音乐节奏相似",
      检查摄像头: "摄像头每15秒旋转一次，有3秒的盲区",
    },
    transitions: {
      // 数据核心室交互逻辑
      躲避摄像头: () => {
        showMessage(
          "你成功躲到了控制台后面，摄像头没有发现你。现在你有机会操作控制台而不被发现。"
        );
        gameState.hasAvoidedCamera = true;
        return "data_core";
      },
      操作控制台A: () => {
        if (!gameState.hasAvoidedCamera) {
          showMessage("摄像头发现了你的活动！警报声响起，门锁死了！");
          gameState.gameOver = true;
          gameState.结局 = "bad";
          endGame();
          return "data_core";
        }
        showMessage(
          '控制台A需要输入密码。屏幕提示："创始人的幸运数字是他女儿的生日月份"'
        );
        return "data_core";
      },
      操作控制台B: () => {
        if (!gameState.hasAvoidedCamera) {
          showMessage("摄像头发现了你的活动！警报声响起，门锁死了！");
          gameState.gameOver = true;
          gameState.结局 = "bad";
          endGame();
          return "data_core";
        }
        showMessage(
          '控制台B需要输入密码。屏幕提示："π的前四位小数（不含小数点）"'
        );
        return "data_core";
      },
      操作控制台C: () => {
        if (!gameState.hasAvoidedCamera) {
          showMessage("摄像头发现了你的活动！警报声响起，门锁死了！");
          gameState.gameOver = true;
          gameState.结局 = "bad";
          endGame();
          return "data_core";
        }
        showMessage('控制台C需要输入密码。屏幕提示："实验室中服务器的数量"');
        return "data_core";
      },
      检查数据核心: () => {
        if (gameState.dataFragments >= 3) {
          showMessage("数据核心已经收集了足够的碎片！你可以尝试上传数据了。");
          return "data_core";
        } else {
          showMessage(
            "数据核心需要至少3个数据碎片才能启动上传程序。你目前有" +
              gameState.dataFragments +
              "个。"
          );
        }
        return "data_core";
      },
    },
  },
  // 红色鲱鱼场景：虚假数据室
  fake_data_room: {
    name: "虚假数据室",
    description: `\n你进入了一个看起来像是数据核心室的房间，但感觉有些不对劲。设备看起来更新，但缺乏真正数据核心的能量感。\n\n环境元素：\n- 中央有一个闪烁的控制台\n- 墙上挂着企业创始人的画像\n- 桌上有一个标有"最高机密"的U盘\n- 角落里有一个保险箱\n- 房间温度异常温暖`,
    actions: [
      "检查控制台",
      "查看画像",
      "拿起U盘",
      "尝试打开保险箱",
      "离开房间",
    ],
    hiddenClues: {
      检查温度: "房间温度比其他区域高5度，这不正常",
      查看U盘内容: "U盘里只有一首企业宣传歌曲",
    },
    transitions: {
      拿起U盘: () => {
        if (!gameState.inventory.includes("虚假U盘")) {
          gameState.inventory.push("虚假U盘");
          showMessage("你拿起了U盘，感觉它异常轻便。");
          updateInventory();
        } else {
          showMessage("你已经拿了U盘。");
        }
        return "fake_data_room";
      },
      尝试打开保险箱: () => {
        showMessage('保险箱需要四位数密码。旁边有一张纸条写着："我的生日"。');
        return "fake_data_room";
      },
      离开房间: () => {
        return "ventilation_shaft";
      },
      检查控制台: () => {
        if (gameState.inventory.includes("虚假U盘")) {
          showMessage(
            "你插入U盘后，屏幕显示：\"恭喜！你找到了'终极数据'！\"但数据看起来像是随机生成的垃圾信息。"
          );
          // 红色鲱鱼：误导玩家以为找到了关键物品
          gameState.dataFragments += 1;
          showMessage("数据碎片计数增加了1！当前：" + gameState.dataFragments);
        } else {
          showMessage("控制台需要插入授权U盘才能访问。");
        }
        return "fake_data_room";
      },
    },
  },
};
// 更多场景定义...
// 此处原代码为对象结束符，推测可能是编辑时误操作，由于不清楚上下文完整逻辑，保持原样
// 由于不清楚具体上下文，推测此处可能是对象定义结束，暂时保留并添加空语句确保语法正确

// DOM元素
const gameOutput = document.getElementById("game-output");
const commandInput = document.getElementById("command");
const actionButtons = document.getElementById("action-buttons");
const inventoryElement = document.getElementById("inventory");

// 初始化游戏
function initGame() {
  showMessage(
    `=== 神经漫游者：数据囚笼 ===\n\n背景：你是一名被雇佣的"数据幽灵"，专门从事高风险的企业数据窃取。在一次对巨型科技公司"神经链接"的任务中，你被陷害并困在他们的秘密实验室。\n\n目标：找到并上传3份加密数据碎片，在系统自毁前逃离实验室。`
  );
  renderScene(gameState.currentScene);
  startGameTimer();
}

// 渲染场景
function renderScene(sceneName) {
  const scene = scenes[sceneName];
  if (!scene) return;

  gameState.currentScene = sceneName;
  showMessage(`\n【场景：${scene.name}】`);
  showMessage(scene.description);
  renderActionButtons(scene.actions);
}

// 显示消息
function showMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.className = "game-message";
  messageElement.textContent = text;
  gameOutput.appendChild(messageElement);
  gameOutput.scrollTop = gameOutput.scrollHeight;
}

// 渲染行动按钮
function renderActionButtons(actions) {
  actionButtons.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-btn";
    button.textContent = action;
    button.onclick = () => handleAction(action);
    actionButtons.appendChild(button);
  });
}

// 处理行动
function handleAction(action) {
  const currentScene = scenes[gameState.currentScene];
  if (currentScene.transitions && currentScene.transitions[action]) {
    const result = currentScene.transitions[action]();
    if (result && scenes[result]) {
      renderScene(result);
    } else if (typeof result === "string") {
      showMessage(result);
    }
  } else {
    handleCustomAction(action);
  }
}

// 处理自定义行动
function handleCustomAction(action) {
  const currentScene = scenes[gameState.currentScene];
  const lowerAction = action.toLowerCase();

  // 检查隐藏线索
  if (currentScene.hiddenClues && currentScene.hiddenClues[lowerAction]) {
    showMessage(currentScene.hiddenClues[lowerAction]);
    return;
  }

  // 处理物品使用
  if (lowerAction.startsWith("使用")) {
    const item = lowerAction.replace("使用", "").trim();
    if (gameState.inventory.includes(item)) {
      handleItemUsage(item);
    } else {
      showMessage(`你没有${item}。`);
    }
    return;
  }

  // 处理物品检查
  if (lowerAction.startsWith("检查") || lowerAction.startsWith("查看")) {
    const target = lowerAction.replace("检查", "").replace("查看", "").trim();
    showMessage(`你仔细检查了${target}，但没有发现什么特别的。`);
    return;
  }

  // 默认响应
  showMessage(`你尝试${action}，但没有任何效果。`);
}

// 处理物品使用
function handleItemUsage(item) {
  switch (item) {
    case "神经刺激针":
      if (!gameState.hasUsedStims) {
        gameState.hasUsedStims = true;
        gameState.gameTime += 5 * 60; // 增加5分钟游戏时间
        showMessage(
          "你注射了神经刺激针，感觉思维变得异常清晰，时间感似乎变慢了。系统倒计时增加了5分钟。"
        );
      } else {
        showMessage("你已经使用过神经刺激针，过量使用会导致神经系统崩溃。");
      }
      break;
    // 其他物品使用逻辑
    default:
      showMessage(`你不知道如何使用${item}。`);
  }
}

// 更新 inventory
function updateInventory() {
  inventoryElement.textContent = `物品：[${gameState.inventory.join(", ")}]`;
}

// 开始游戏计时器
function startGameTimer() {
  const timerInterval = setInterval(() => {
    gameState.gameTime++;
    const minutes = Math.floor(gameState.gameTime / 60);
    const seconds = gameState.gameTime % 60;

    // 检查游戏结束条件
    if (minutes >= 60 && !gameState.gameOver) {
      clearInterval(timerInterval);
      gameState.gameOver = true;
      gameState.结局 = "bad";
      endGame();
    }

    // 更新手环显示（每30秒）
    if (gameState.gameTime % 30 === 0) {
      const remainingMinutes = 59 - minutes;
      const remainingSeconds = 59 - seconds;
      showMessage(
        `神经手环闪烁："警告：自毁倒计时 ${remainingMinutes}:${
          remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
        }"`
      );
    }
  }, 1000);
}

// 结束游戏
function endGame() {
  showMessage("\n=== 游戏结束 ===");
  switch (gameState.结局) {
    case "bad":
      showMessage(
        "实验室在一阵剧烈的爆炸声中化为灰烬。你未能及时逃脱...\n\n【坏结局：数据湮灭】"
      );
      break;
    case "normal":
      showMessage(
        "你成功上传了足够的数据碎片并逃离了实验室，但在逃亡过程中被神经链接的安保部队发现...\n\n【普通结局：亡命天涯】"
      );
      break;
    case "perfect":
      showMessage(
        "你不仅成功上传了所有数据碎片，还揭露了神经链接公司的非法实验。你的名字成为了地下网络中的传奇...\n\n【完美结局：数字自由】"
      );
      break;
  }
  actionButtons.innerHTML = "";
  commandInput.disabled = true;
}

// 提交命令
function submitCommand() {
  const command = commandInput.value.trim();
  if (!command || gameState.gameOver) return;

  showMessage(`> ${command}`);
  handleCustomAction(command);
  commandInput.value = "";
}

// 键盘事件监听
commandInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitCommand();
  }
});

// 启动游戏
window.onload = initGame;
