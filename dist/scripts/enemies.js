import { addHitEffect, addMessage } from './effects.js'

export const enemySpawnTimer = (game) => {
    game.enemySpawnTimer -= game.deltaTime
    let enemyHealth = 1
    if (game.timer > 30 && game.timer < 60) {
        enemyHealth = 2
    } else if (game.timer > 60) {
        enemyHealth = 3
    }

    if (game.enemySpawnTimer <= 0) {
        spawnEnemy(game, enemyHealth)
        game.enemySpawnTimer = game.enemySpawnInterval
    }
}

export const updateEnemies = (game) => {
    game.enemyIntervalTimer -= game.deltaTime
    if (game.enemyIntervalTimer <= 0) {
        game.enemySpawnInterval *= 0.9
        game.enemyIntervalTimer = 20
    }

    const margin = 1

    game.enemies.forEach((enemy, index) => {
        game.bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(enemy, bullet)) {
                game.bullets.splice(bulletIndex, 1)
                enemy.health--
                game.playerMoney++
                addMessage(game, enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, 'yellow', '+1', game.sprites.coin1)
                if (enemy.health <= 0) {
                    addHitEffect(game, enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, bullet.color, enemy.size / 2)
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
                addMessage(game, enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, 'red', `-${enemy.health}`, game.sprites.flask1)
                game.playerHealth -= enemy.health
            }
        }
    })
}

export const drawEnemies = (ctx, game) => {
    game.enemies.forEach(enemy => {
        let sprite = game.sprites.skull1

        if (enemy.animationTimer >= 0.75) {
            sprite = game.sprites.skull1

        } else if (enemy.animationTimer >= 0.50) {
            sprite = game.sprites.skull2

        } else if (enemy.animationTimer >= 0.25) {
            sprite = game.sprites.skull3

        } else {
            sprite = game.sprites.skull4
        }

        if (enemy.health > 2) {
            ctx.filter = 'drop-shadow(2px 2px black) invert(100%)'
        } else if (enemy.health > 1) {
            ctx.filter = 'drop-shadow(2px 2px black)'
        } else {
            ctx.filter = 'drop-shadow(2px 2px black) grayscale(100%)'
        }
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(sprite, Math.floor(enemy.x), Math.floor(enemy.y), enemy.size, enemy.size)
        ctx.filter = 'none'
    })
}

export const spawnEnemy = (game, enemyHealth) => {
    const enemy = {
        x: (game.startTile.x * game.tileSize) + (game.tileSize / 4),
        y: (game.startTile.y * game.tileSize) + (game.tileSize / 4),
        size: game.tileSize / 2,
        vel: game.tileSize,
        pathIndex: 0,
        health: enemyHealth,
        animationTimer: 1
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