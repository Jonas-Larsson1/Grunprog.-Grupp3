import { spawnBullet } from "./bullets.js";

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

    enemies.forEach(enemy => {
        const distance = calculateDistance(tower, enemy)

        if (distance < shortestDistance) {
            shortestDistance = distance
            closestEnemy = enemy
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
    if (clickedTile) {
        if (clickedTile.special === '' && !clickedTile.path) {
            const tower = {
                x: (clickedTile.x * game.tileSize) + (game.tileSize / 4),
                y: (clickedTile.y * game.tileSize) + (game.tileSize / 4),
                xCord: clickedTile.x,
                yCord: clickedTile.y,
                size: game.tileSize / 2,
                attackRange: 100,
                damage: 10,
                attackCooldown: 1,
                lastAttackTime: 0
            };
    
            game.towers.push(tower);

            clickedTile.special = 'tower';
        }
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