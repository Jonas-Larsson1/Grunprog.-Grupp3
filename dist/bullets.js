export const createBullet = (startX, startY, targetX, targetY, speed) => {
    return {
        x: startX,
        y: startY,
        targetX: targetX,
        targetY: targetY,
        speed: speed,
    };
};

export const updateBullets = (game) => {
    game.bullets.forEach((bullet, index) => {
        const deltaX = bullet.targetX - bullet.x;
        const deltaY = bullet.targetY - bullet.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const speedX = (deltaX / distance) * bullet.speed;
        const speedY = (deltaY / distance) * bullet.speed;

        bullet.x += speedX * game.deltaTime;
        bullet.y += speedY * game.deltaTime;

        // försökte ta bort kulor men misslyckades 
        if (distance < bullet.speed * game.deltaTime || bullet.lifetime <= 0) {
            game.bullets.splice(index, 1);
        } else {
            bullet.lifetime -= game.deltaTime;
        }
    });
};

export const spawnBullet = (game, tower, enemy) => {
    const numBullets = 5; 
    const startX = tower.x + tower.size / 2;
    const startY = tower.y + tower.size / 2;
    const targetX = enemy.x;
    const targetY = enemy.y;
    const deltaX = (targetX - startX) / numBullets; // ändrad position 
    const deltaY = (targetY - startY) / numBullets;

    for (let i = 0; i < numBullets; i++) {
        // räkna ut position och skapa en ny kula 
        const bullet = createBullet(startX + i * deltaX, startY + i * deltaY, targetX, targetY, 300); // för att skapa en rad 
        game.bullets.push(bullet);
    }
};
