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
        game.enemySpawnTimer = Math.random() * 2 + 2
    }
}

export const updateEnemies = (game) => {
    const margin = 1

    game.enemies.forEach(enemy => {
        const target = game.path[enemy.pathIndex]
        const speed = enemy.vel * game.deltaTime

        const distanceX = Math.round(Math.abs(enemy.x - target.x))
        const distanceY = Math.round(Math.abs(enemy.y - target.y))

        if (enemy.x < target.x && distanceX != 0) enemy.x += speed
        else if (enemy.x > target.x && distanceX != 0) enemy.x -= speed
        else if (enemy.y < target.y) enemy.y += speed
        else if (enemy.y > target.y) enemy.y -= speed

        if (distanceX <= margin && distanceY <= margin) {
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
    console.log(game.enemies[0])

    const enemy = {
        x: (game.startTile.x * game.tileSize) + (game.tileSize / 4),
        y: (game.startTile.y * game.tileSize) + (game.tileSize / 4),
        size: game.tileSize / 2,
        vel: 25,
        pathIndex: 0,
    }

    game.enemies.push(enemy)
}