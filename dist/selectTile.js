import { createBullet, updateBullets, spawnBullet } from './bullets.js'

export const clickTile = (event, game, canvas) => {
    console.log('Tile clicked!');
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const tileX = Math.floor(x / game.tileSize)
    const tileY = Math.floor(y / game.tileSize)

    const tileToChange = game.allTiles.findIndex((tile) => tile.x === tileX && tile.y === tileY)
    
    const clickedTile = game.allTiles[tileToChange];

    // placera ett torn på en clickedTile

    if (clickedTile.special === '' && !clickedTile.path) {
        const tower = {
            x: tileX * game.tileSize,
            y: tileY * game.tileSize,
            size: game.tileSize / 2,
            attackRange: 100,
            damage: 10,
            attackCooldown: 1,
            lastAttackTime: 0
        };

        game.towers.push(tower);
        clickedTile.special = 'tower';

    // fiendens position
    const targetEnemy  = game.enemies[0];
    if (targetEnemy) {
        spawnBullet(game, tower, targetEnemy);
    }
    }
}