export const createBullet = (startX, startY, targetX, targetY, speed) => {
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const speedX = (deltaX / distance) * speed;
    const speedY = (deltaY / distance) * speed;

    return {
        x: startX,
        y: startY,
        size: 5,
        targetX: targetX,
        targetY: targetY,
        speed: speed,
        speedX: speedX,
        speedY: speedY,
        lifeTime: 1,
    };
};

export const updateBullets = (game) => {
    game.bullets.forEach((bullet, index) => {

        bullet.lifeTime -= game.deltaTime

        if (bullet.lifeTime <= 0) {
            game.bullets.splice(index, 1)
        } else {
            bullet.x += bullet.speedX * game.deltaTime;
            bullet.y += bullet.speedY * game.deltaTime;
        }
    });
};

export const spawnBullet = (game, tower, enemy) => {
    if (enemy) {
        const numBullets = 1; 
        const startX = tower.x + tower.size / 2;
        const startY = tower.y + tower.size / 2;
        const targetX = enemy.x;
        const targetY = enemy.y;
        // const deltaX = (targetX - startX) / numBullets; // ändrad position 
        // const deltaY = (targetY - startY) / numBullets;
        
        for (let i = 0; i < numBullets; i++) {
            // räkna ut position och skapa en ny kula 
            console.log('spawned bullet')
            const bullet = createBullet(startX, startY, targetX, targetY, 300); // för att skapa en rad 
            game.bullets.push(bullet);
        }
    }
}
