import { spawnBullet } from "./bullets.js";

export const updateTowers = (game) => {
    game.towers.forEach(tower => {
        tower.attackCooldown -= game.deltaTime
        if (tower.attackCooldown <= 0) {
            spawnBullet(game, tower, game.enemies[0])
            tower.attackCooldown = 2
        }
    });
} 

export const spawnTower = (clickedTile, game) => {
    console.log(clickedTile)
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
    }
}