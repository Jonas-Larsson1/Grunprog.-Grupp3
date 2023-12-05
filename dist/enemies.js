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
        game.enemySpawnTimer = Math.random() * 3 + 1
    }
}

export const updateEnemies = (game) => {
    const margin = 1

    game.enemies.forEach((enemy, index) => {
        const target = game.path[enemy.pathIndex]

        const speed = enemy.vel * game.deltaTime

        const distanceX = Math.round(Math.abs(enemy.x - target.x))
        const distanceY = Math.round(Math.abs(enemy.y - target.y))

        if (enemy.x < target.x && distanceX != 0) enemy.x += speed
        else if (enemy.x > target.x && distanceX != 0) enemy.x -= speed
        else if (enemy.y < target.y) enemy.y += speed
        else if (enemy.y > target.y) enemy.y -= speed

        if (distanceX <= margin && distanceY <= margin) {
            if (enemy.pathIndex < game.path.length - 1) {
                enemy.pathIndex++
            } else {
                game.enemies.splice(index, 1)
            }
        }
    })
}

export const drawEnemies = (ctx, game) => {
    // if (game.enemies.length > 0) {
    //     console.log(game.enemies[0].pathIndex)
    // }

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
        vel: 50,
        pathIndex: 0,
    }

    game.enemies.push(enemy)
}