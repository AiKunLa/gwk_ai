document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const startBtn = document.getElementById('startBtn');

    // 游戏配置
    const GAME_CONFIG = {
        gridSize: 30,
        tileCount: 20,
        playerSpeed: 3,
        bulletSpeed: 5,
        enemySpeed: 1,
        enemySpawnRate: 2000,
        wallCount: 20
    };

    // 设置画布大小
    canvas.width = GAME_CONFIG.gridSize * GAME_CONFIG.tileCount;
    canvas.height = GAME_CONFIG.gridSize * GAME_CONFIG.tileCount;

    // 游戏状态
    let score = 0;
    let lives = 3;
    let isGameRunning = false;
    let gameLoop;
    let lastEnemySpawn = 0;

    // 游戏对象数组
    let playerTank = null;
    const bullets = [];
    const enemyTanks = [];
    const walls = [];
    const explosions = [];

    // 键盘状态
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false
    };

    // 初始化游戏
    function initGame() {
        // 重置游戏状态
        score = 0;
        lives = 3;
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        bullets.length = 0;
        enemyTanks.length = 0;
        explosions.length = 0;

        // 创建玩家坦克
        playerTank = {
            x: canvas.width / 2 - GAME_CONFIG.gridSize / 2,
            y: canvas.height - GAME_CONFIG.gridSize * 2,
            width: GAME_CONFIG.gridSize * 0.8,
            height: GAME_CONFIG.gridSize * 0.8,
            speed: GAME_CONFIG.playerSpeed,
            direction: 'up',
            color: '#3498db',
            isShooting: false,
            shootCooldown: 300,
            lastShot: 0
        };

        // 生成随机墙壁
        generateWalls();

        // 开始游戏循环
        if (gameLoop) cancelAnimationFrame(gameLoop);
        gameLoop = requestAnimationFrame(updateGame);
    }

    // 生成随机墙壁
    function generateWalls() {
        walls.length = 0;
        for (let i = 0; i < GAME_CONFIG.wallCount; i++) {
            // 确保墙壁不会生成在玩家初始位置
            let wallX, wallY;
            do {
                wallX = Math.floor(Math.random() * (canvas.width / GAME_CONFIG.gridSize)) * GAME_CONFIG.gridSize;
                wallY = Math.floor(Math.random() * (canvas.height / GAME_CONFIG.gridSize)) * GAME_CONFIG.gridSize;
            } while (
                Math.abs(wallX - playerTank.x) < GAME_CONFIG.gridSize * 3 && 
                Math.abs(wallY - playerTank.y) < GAME_CONFIG.gridSize * 3
            );

            walls.push({
                x: wallX,
                y: wallY,
                width: GAME_CONFIG.gridSize,
                height: GAME_CONFIG.gridSize,
                isDestructible: Math.random() > 0.3 // 30%概率为不可破坏墙壁
            });
        }
    }

    // 生成敌人坦克
    function spawnEnemy() {
        const spawnPositions = [
            { x: GAME_CONFIG.gridSize, y: GAME_CONFIG.gridSize },
            { x: canvas.width / 2 - GAME_CONFIG.gridSize / 2, y: GAME_CONFIG.gridSize },
            { x: canvas.width - GAME_CONFIG.gridSize * 2, y: GAME_CONFIG.gridSize }
        ];

        const position = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
        enemyTanks.push({
            x: position.x,
            y: position.y,
            width: GAME_CONFIG.gridSize * 0.8,
            height: GAME_CONFIG.gridSize * 0.8,
            speed: GAME_CONFIG.enemySpeed,
            direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
            color: '#e74c3c',
            changeDirectionTime: 0,
            lastDirectionChange: 0
        });
    }

    // 玩家射击
    function playerShoot() {
        const now = Date.now();
        if (now - playerTank.lastShot < playerTank.shootCooldown) return;

        playerTank.lastShot = now;
        let bulletX, bulletY;

        // 根据坦克方向计算子弹初始位置
        switch (playerTank.direction) {
            case 'up':
                bulletX = playerTank.x + playerTank.width / 2 - 2;
                bulletY = playerTank.y - 10;
                break;
            case 'down':
                bulletX = playerTank.x + playerTank.width / 2 - 2;
                bulletY = playerTank.y + playerTank.height;
                break;
            case 'left':
                bulletX = playerTank.x - 10;
                bulletY = playerTank.y + playerTank.height / 2 - 2;
                break;
            case 'right':
                bulletX = playerTank.x + playerTank.width;
                bulletY = playerTank.y + playerTank.height / 2 - 2;
                break;
        }

        bullets.push({
            x: bulletX,
            y: bulletY,
            width: 4,
            height: 4,
            speed: GAME_CONFIG.bulletSpeed,
            direction: playerTank.direction,
            isPlayerBullet: true
        });
    }

    // 绘制坦克
    function drawTank(tank) {
        ctx.save();
        ctx.translate(tank.x + tank.width / 2, tank.y + tank.height / 2);

        // 根据方向旋转坦克
        switch (tank.direction) {
            case 'right':
                ctx.rotate(Math.PI / 2);
                break;
            case 'down':
                ctx.rotate(Math.PI);
                break;
            case 'left':
                ctx.rotate(3 * Math.PI / 2);
                break;
        }

        ctx.translate(-tank.width / 2, -tank.height / 2);

        // 绘制坦克主体
        ctx.fillStyle = tank.color;
        ctx.fillRect(0, 0, tank.width, tank.height);

        // 绘制坦克炮管
        ctx.fillStyle = '#333';
        ctx.fillRect(tank.width / 2 - 2, -tank.height / 2, 4, tank.height / 2);

        ctx.restore();
    }

    // 绘制子弹
    function drawBullet(bullet) {
        ctx.fillStyle = bullet.isPlayerBullet ? '#f39c12' : '#ecf0f1';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // 绘制墙壁
    function drawWall(wall) {
        ctx.fillStyle = wall.isDestructible ? '#95a5a6' : '#2c3e50';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        // 添加墙壁纹理
        if (!wall.isDestructible) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(wall.x + 5, wall.y + 5, wall.width - 10, wall.height - 10);
        }
    }

    // 绘制爆炸效果
    function drawExplosion(explosion) {
        ctx.save();
        ctx.globalAlpha = explosion.alpha;
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 绘制游戏元素
    function drawGame() {
        // 清空画布
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制网格
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += GAME_CONFIG.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += GAME_CONFIG.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 绘制墙壁
        walls.forEach(wall => drawWall(wall));

        // 绘制子弹
        bullets.forEach(bullet => drawBullet(bullet));

        // 绘制玩家坦克
        if (playerTank) drawTank(playerTank);

        // 绘制敌人坦克
        enemyTanks.forEach(enemy => drawTank(enemy));

        // 绘制爆炸效果
        explosions.forEach(explosion => drawExplosion(explosion));
    }

    // 更新玩家坦克
    function updatePlayer() {
        if (!playerTank) return;

        // 保存原始位置用于碰撞检测
        const originalX = playerTank.x;
        const originalY = playerTank.y;

        // 根据按键状态移动坦克
        if (keys.ArrowUp) {
            playerTank.direction = 'up';
            playerTank.y -= playerTank.speed;
        } else if (keys.ArrowDown) {
            playerTank.direction = 'down';
            playerTank.y += playerTank.speed;
        } else if (keys.ArrowLeft) {
            playerTank.direction = 'left';
            playerTank.x -= playerTank.speed;
        } else if (keys.ArrowRight) {
            playerTank.direction = 'right';
            playerTank.x += playerTank.speed;
        }

        // 射击
        if (keys.Space) {
            playerShoot();
        }

        // 边界检测
        if (playerTank.x < 0) playerTank.x = 0;
        if (playerTank.x + playerTank.width > canvas.width) playerTank.x = canvas.width - playerTank.width;
        if (playerTank.y < 0) playerTank.y = 0;
        if (playerTank.y + playerTank.height > canvas.height) playerTank.y = canvas.height - playerTank.height;

        // 墙壁碰撞检测
        if (checkWallCollision(playerTank)) {
            playerTank.x = originalX;
            playerTank.y = originalY;
        }
    }

    // 更新敌人坦克
    function updateEnemies() {
        const now = Date.now();

        // 生成新敌人
        if (now - lastEnemySpawn > GAME_CONFIG.enemySpawnRate && enemyTanks.length < 5) {
            spawnEnemy();
            lastEnemySpawn = now;
        }

        // 更新敌人位置和行为
        enemyTanks.forEach(enemy => {
            // 随机改变方向
            if (now - enemy.lastDirectionChange > enemy.changeDirectionTime) {
                enemy.direction = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
                enemy.changeDirectionTime = Math.random() * 2000 + 1000;
                enemy.lastDirectionChange = now;
            }

            // 保存原始位置用于碰撞检测
            const originalX = enemy.x;
            const originalY = enemy.y;

            // 移动敌人
            switch (enemy.direction) {
                case 'up':
                    enemy.y -= enemy.speed;
                    break;
                case 'down':
                    enemy.y += enemy.speed;
                    break;
                case 'left':
                    enemy.x -= enemy.speed;
                    break;
                case 'right':
                    enemy.x += enemy.speed;
                    break;
            }

            // 边界检测和反弹
            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width ||
                enemy.y < 0 || enemy.y + enemy.height > canvas.height) {
                // 碰到边界时反向
                switch (enemy.direction) {
                    case 'up': enemy.direction = 'down'; break;
                    case 'down': enemy.direction = 'up'; break;
                    case 'left': enemy.direction = 'right'; break;
                    case 'right': enemy.direction = 'left'; break;
                }
                enemy.x = originalX;
                enemy.y = originalY;
            }

            // 墙壁碰撞检测和反弹
            if (checkWallCollision(enemy)) {
                // 碰到墙壁时随机改变方向
                const directions = ['up', 'down', 'left', 'right'];
                const currentDirIndex = directions.indexOf(enemy.direction);
                directions.splice(currentDirIndex, 1); // 移除当前方向
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
                enemy.x = originalX;
                enemy.y = originalY;
            }
        });
    }

    // 更新子弹
    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];

            // 移动子弹
            switch (bullet.direction) {
                case 'up':
                    bullet.y -= bullet.speed;
                    break;
                case 'down':
                    bullet.y += bullet.speed;
                    break;
                case 'left':
                    bullet.x -= bullet.speed;
                    break;
                case 'right':
                    bullet.x += bullet.speed;
                    break;
            }

            // 子弹超出边界则移除
            if (bullet.x < 0 || bullet.x > canvas.width ||
                bullet.y < 0 || bullet.y > canvas.height) {
                bullets.splice(i, 1);
                continue;
            }

            // 子弹与墙壁碰撞检测
            let wallHitIndex = -1;
            const wallHit = walls.some((wall, index) => {
                if (checkCollision(bullet, wall)) {
                    wallHitIndex = index;
                    return true;
                }
                return false;
            });

            if (wallHit) {
                // 如果是可破坏墙壁，移除墙壁
                if (walls[wallHitIndex].isDestructible) {
                    // 添加爆炸效果
                    explosions.push({
                        x: bullet.x + bullet.width / 2,
                        y: bullet.y + bullet.height / 2,
                        radius: 5,
                        alpha: 1,
                        maxRadius: 15
                    });
                    walls.splice(wallHitIndex, 1);
                }
                bullets.splice(i, 1);
                continue;
            }

            // 玩家子弹与敌人碰撞检测
            if (bullet.isPlayerBullet) {
                for (let j = enemyTanks.length - 1; j >= 0; j--) {
                    if (checkCollision(bullet, enemyTanks[j])) {
                        // 添加爆炸效果
                        explosions.push({
                            x: enemyTanks[j].x + enemyTanks[j].width / 2,
                            y: enemyTanks[j].y + enemyTanks[j].height / 2,
                            radius: 10,
                            alpha: 1,
                            maxRadius: 25
                        });

                        // 移除敌人和子弹
                        enemyTanks.splice(j, 1);
                        bullets.splice(i, 1);

                        // 增加分数
                        score += 100;
                        scoreElement.textContent = score;
                        break;
                    }
                }
            } else {
                // 敌人子弹与玩家碰撞检测
                if (playerTank && checkCollision(bullet, playerTank)) {
                    // 添加爆炸效果
                    explosions.push({
                        x: playerTank.x + playerTank.width / 2,
                        y: playerTank.y + playerTank.height / 2,
                        radius: 10,
                        alpha: 1,
                        maxRadius: 25
                    });

                    // 移除子弹
                    bullets.splice(i, 1);

                    // 减少生命值
                    lives--;
                    livesElement.textContent = lives;

                    if (lives <= 0) {
                        gameOver();
                    } else {
                        // 重置玩家位置
                        playerTank.x = canvas.width / 2 - GAME_CONFIG.gridSize / 2;
                        playerTank.y = canvas.height - GAME_CONFIG.gridSize * 2;
                    }
                }
            }
        }
    }

    // 更新爆炸效果
    function updateExplosions() {
        for (let i = explosions.length - 1; i >= 0; i--) {
            const explosion = explosions[i];
            explosion.radius += 0.5;
            explosion.alpha -= 0.02;

            if (explosion.alpha <= 0 || explosion.radius >= explosion.maxRadius) {
                explosions.splice(i, 1);
            }
        }
    }

    // 碰撞检测函数
    function checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    // 墙壁碰撞检测
    function checkWallCollision(rect) {
        return walls.some(wall => checkCollision(rect, wall));
    }

    // 游戏结束
    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(gameLoop);
        alert(`游戏结束！最终得分: ${score}`);
        startBtn.textContent = '开始游戏';
    }

    // 游戏主循环
    function updateGame() {
        if (!isGameRunning) return;

        updatePlayer();
        updateEnemies();
        updateBullets();
        updateExplosions();
        drawGame();

        gameLoop = requestAnimationFrame(updateGame);
    }

    // 事件监听
    startBtn.addEventListener('click', () => {
        if (isGameRunning) {
            isGameRunning = false;
            cancelAnimationFrame(gameLoop);
            startBtn.textContent = '继续游戏';
        } else {
            isGameRunning = true;
            initGame();
            startBtn.textContent = '暂停游戏';
        }
    });

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    // 初始绘制
    drawGame();
});