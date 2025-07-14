document.addEventListener('DOMContentLoaded', function() {
    // 获取画布和上下文
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');

    // 游戏配置
    const gridSize = 20; // 网格大小
    const tileCount = 20; // 网格数量
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    // 游戏状态
    let snake = [{x: 10, y: 10}]; // 蛇身体 segments
    let direction = {x: 0, y: 0}; // 移动方向
    let food = {x: 5, y: 5}; // 食物位置
    let score = 0; // 分数
    let gameInterval = null; // 游戏循环定时器
    let isGameRunning = false; // 游戏运行状态

    // 初始化游戏
    function initGame() {
        snake = [{x: 10, y: 10}];
        direction = {x: 0, y: 0};
        score = 0;
        scoreElement.textContent = score;
        generateFood();
        draw();
    }

    // 生成食物
    function generateFood() {
        // 随机生成食物位置，确保不在蛇身上
        do {
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }

    // 绘制游戏元素
    function draw() {
        // 清空画布
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制蛇
        ctx.fillStyle = '#2ecc71';
        snake.forEach((segment, index) => {
            // 蛇头特殊颜色
            if (index === 0) {
                ctx.fillStyle = '#27ae60';
            }
            ctx.fillRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize - 1, // 留1px间隙
                gridSize - 1
            );
        });

        // 绘制食物
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // 更新游戏状态
    function update() {
        // 移动蛇头
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood();
        } else {
            // 没吃到食物则移除尾部
            snake.pop();
        }

        // 检查碰撞
        if (checkCollision()) {
            gameOver();
            return;
        }

        draw();
    }

    // 检查碰撞
    function checkCollision() {
        const head = snake[0];
        // 边界碰撞
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        // 自身碰撞
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // 游戏结束
    function gameOver() {
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = '重新开始';
        alert(`游戏结束！最终得分: ${score}`);
    }

    // 处理键盘输入
    document.addEventListener('keydown', (e) => {
        // 防止游戏未开始时响应键盘
        if (!isGameRunning) return;

        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = {x: 1, y: 0};
                break;
        }
    });

    // 开始/重新开始游戏
    startBtn.addEventListener('click', () => {
        if (isGameRunning) {
            clearInterval(gameInterval);
        }
        isGameRunning = true;
        startBtn.textContent = '暂停游戏';
        direction = {x: 1, y: 0}; // 初始向右移动
        initGame();
        gameInterval = setInterval(update, 150); // 游戏速度
    });

    // 初始绘制
    initGame();
});