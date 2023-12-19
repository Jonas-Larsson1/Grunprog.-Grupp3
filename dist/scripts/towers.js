import { spawnBullet } from './bullets.js';

export const updateTowers = (game) => {
    game.towers.forEach(tower => {
        tower.attackCooldown -= game.deltaTime
        if (tower.attackCooldown <= 0) {
            const closestEnemy = findClosestEnemy(tower, game.enemies)

            if (closestEnemy) {
                spawnBullet(game, tower, closestEnemy)
                tower.attackCooldown = 2
            }
        }
    })
}

const findClosestEnemy = (tower, enemies) => {
    let closestEnemy = null
    let shortestDistance = Infinity
    let lowestHealth

    enemies.forEach(enemy => {
        let distance = calculateDistance(tower, enemy)

        if (lowestHealth) {
            if (enemy.health < lowestHealth) {
                distance *= 0.5
            }
        }
        if (distance < shortestDistance) {
            shortestDistance = distance
            closestEnemy = enemy
            lowestHealth = enemy.health
        }
    })

    return closestEnemy
}

const calculateDistance = (point1, point2) => {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y
    return Math.sqrt(dx * dx + dy * dy)
}

export const spawnTower = (clickedTile, game) => {
    const tower = {
        x: (clickedTile.x * game.tileSize) + (game.tileSize / 4),
        y: (clickedTile.y * game.tileSize) + (game.tileSize / 4),
        xCord: clickedTile.x,
        yCord: clickedTile.y,
        size: game.tileSize / 2,
        attackRange: 1,
        attackCooldown: 1,
        lastAttackTime: 0,
        upgrade: 1
    }

    game.towers.push(tower)

    clickedTile.special = 'tower'
}

export const upgradeTower = (tower, game) => {
    if (tower.upgrade < 3) {
        tower.upgrade++
        tower.attackRange *= 2
        tower.attackCooldown *= 0.5
    }
}

export const removeTower = (clickedTile, game) => {
    if (clickedTile && clickedTile.special === 'tower') {
        game.towers = game.towers.filter(tower =>
            !(tower.xCord === clickedTile.x && tower.yCord === clickedTile.y)
        )

        clickedTile.special = ''
        return true
    }
}

export const getTowerAtTile = (tile, game) => {
    return game.towers.find(tower => tower.xCord === tile.x && tower.yCord === tile.y)
}