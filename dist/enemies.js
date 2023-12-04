// export class Enemy {
//     constructor(x, y, speed, health) {
//         this.x = x;
//         this.y = y;
//         this.speed = speed;
//         this.health = health;
//     }
// }

export const enemySpawnTimer = (game) => {
    game.enemySpawnTimer -= game.deltaTime
    if (game.enemySpawnTimer <= 0) {
        spawnEnemy(game)
        game.enemySpawnTimer = Math.random() * 2 + 1
    }
}

export const updateEnemies = (game) => {
    game.enemies.forEach(enemy => {
        const target = game.path[enemy.pathIndex]
        if (enemy.x < target.x) {
            enemy.x += enemy.vel * game.deltaTime
        } else if (enemy.x > target.x) {
            enemy.x -= enemy.vel * game.deltaTime
        } else if (enemy.y < target.y) {
            enemy.y += enemy.vel * game.deltaTime
        } else if (enemy.y > target.y) {
            enemy.y -= enemy.vel * game.deltaTime
        } else if (enemy.x === target.x && enemy.y === target.y) {
            enemy.pathIndex++
        }
    })
}

export const drawEnemies = (ctx, game) => {
    game.enemies.forEach(enemy => {
        ctx.fillStyle = 'red'
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size)
    })
}

export const spawnEnemy = (game) => {
    const enemy = {
        x: (game.startTile.x * game.tileSize) + (game.tileSize / 4),
        y: (game.startTile.y * game.tileSize) + (game.tileSize / 4),
        size: game.tileSize / 2,
        vel: 25,
        pathIndex: 0,
    }

    game.enemies.push(enemy)
}