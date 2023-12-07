import { spawnBullet } from "./bullets.js";

export const updateTowers = (game) => {
    game.towers.forEach(tower => {
        tower.attackCooldown -= game.deltaTime

        if (tower.attackCooldown <= 0) {
            console.log('pang')
            spawnBullet(game, tower, game.enemies[0])
            tower.attackCooldown = 2
        }
    });
} 
