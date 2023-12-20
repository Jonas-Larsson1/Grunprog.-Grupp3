export const createBullet = (startX, startY, targetX, targetY, speed, attackRange, upgrade) => {
    const deltaX = targetX - startX
    const deltaY = targetY - startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const speedX = (deltaX / distance) * speed
    const speedY = (deltaY / distance) * speed

    let size = 6
    let color = 'yellow'
    if (upgrade === 2) {
        size = 12
    } else if (upgrade === 3) {
        size = 12
        color = '#62abd4'
    }

    return {
        x: startX,
        y: startY,
        size: size,
        targetX: targetX,
        targetY: targetY,
        speed: speed,
        speedX: speedX,
        speedY: speedY,
        lifeTime: attackRange,
        color: color
    }
}

export const updateBullets = (game) => {
    game.bullets.forEach((bullet, index) => {

        bullet.lifeTime -= game.deltaTime

        if (bullet.lifeTime <= 0) {
            game.bullets.splice(index, 1)
        } else {
            bullet.x += bullet.speedX * game.deltaTime
            bullet.y += bullet.speedY * game.deltaTime
        }
    })
}

export const spawnBullet = (game, tower, enemy) => {
    if (enemy) {
        const numBullets = 1
        const startX = tower.x + tower.size / 2
        const startY = tower.y + tower.size / 2
        const targetX = enemy.x + enemy.size / 2
        const targetY = enemy.y + enemy.size / 2

        for (let i = 0; i < numBullets; i++) {
            // räkna ut position och skapa en ny kula 
            const bullet = createBullet(startX, startY, targetX, targetY, (tower.upgrade * game.tileSize) * 3, tower.attackRange, tower.upgrade) // för att skapa en rad 
            game.bullets.push(bullet)
        }
    }
}