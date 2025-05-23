document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 游戏配置
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    // 蛇的初始位置和方向
    let snake = [{x: 10, y: 10}];
    let direction = {x: 0, y: 0};

    // 食物的位置
    let food = {x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount)};

    // 游戏循环
    function gameLoop() {
        // 清除画布
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制蛇
        ctx.fillStyle = '#000';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        // 绘制食物
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        // 移动蛇
        let head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            // 生成新的食物
            food = {x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount)};
        } else {
            // 移除蛇的尾部
            snake.pop();
        }

        // 检查游戏结束条件
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            clearInterval(gameInterval);
            alert('游戏结束！');
        }

        // 检查蛇是否撞到自己
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                clearInterval(gameInterval);
                alert('游戏结束！');
            }
        }
    }

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
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

    // 启动游戏循环
    let gameInterval = setInterval(gameLoop, 100);
});