import { addHitEffect } from "./effects.js"

export const enemySpawnTimer = (game) => {
    game.enemySpawnTimer -= game.deltaTime
    if (game.enemySpawnTimer <= 0) {
        spawnEnemy(game)
        game.enemySpawnTimer = game.enemySpawnInterval
    }
}

export const updateEnemies = (game) => {
    game.enemyIntervalTimer -= game.deltaTime
    if (game.enemyIntervalTimer <= 0) {
        game.enemySpawnInterval *= 0.9
        game.enemyIntervalTimer = 10
    }

    const margin = 1

    game.enemies.forEach((enemy, index) => {
        game.bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(enemy, bullet)) {
                console.log(enemy.health)
                game.bullets.splice(bulletIndex, 1)
                enemy.health--
                console.log(enemy.health)
                if (enemy.health <= 0) {
                    addHitEffect(game, enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, '#62abd4', enemy.size / 2)
                    game.enemies.splice(index, 1)
                    game.enemiesKilled++
                    game.playerMoney++
                    return
                }
            }
        })

        enemy.animationTimer -= game.deltaTime

        if (enemy.animationTimer < 0) {
            enemy.animationTimer = 1
        }

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
                game.playerHealth--
            }
        }
    })
}

export const drawEnemies = (ctx, game) => {
    game.enemies.forEach(enemy => {
        let sprite = game.skull1Sprite

        if (enemy.animationTimer >= 0.75) {
            sprite = game.skull1Sprite

        } else if (enemy.animationTimer >= 0.50) {
            sprite = game.skull2Sprite

        } else if (enemy.animationTimer >= 0.25) {
            sprite = game.skull3Sprite

        } else {
            sprite = game.skull4Sprite
        }

        if (enemy.health < 2) {
            ctx.filter = "drop-shadow(1px 1px 5px black) grayscale(100%)"
        } else {
            ctx.filter = "drop-shadow(1px 1px 5px black)"
        }
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(sprite, enemy.x, enemy.y, enemy.size, enemy.size)
        ctx.filter = "none"
    })
}

export const spawnEnemy = (game) => {
    const enemy = {
        x: (game.startTile.x * game.tileSize) + (game.tileSize / 4),
        y: (game.startTile.y * game.tileSize) + (game.tileSize / 4),
        size: game.tileSize / 2,
        vel: 50,
        pathIndex: 0,
        health: 2,
        animationTimer: 1,
    }

    game.enemies.push(enemy)
}

const checkCollision = (rect1, rect2) => {
    if (
        rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y
      ) {
        return true
    }
}