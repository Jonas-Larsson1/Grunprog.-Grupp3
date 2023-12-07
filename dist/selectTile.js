
export const clickTile = (event, game, canvas) => {
    // console.log('Tile clicked!');
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const tileX = Math.floor(x / game.tileSize)
    const tileY = Math.floor(y / game.tileSize)

    const tileToChange = game.allTiles.findIndex((tile) => tile.x === tileX && tile.y === tileY)
    
    const clickedTile = game.allTiles[tileToChange]

    spawnTower(clickedTile, game)

    return 
}

const spawnTower = (clickedTile, game) => {
    if (clickedTile.special === '' && !clickedTile.path) {
        const tower = {
            x: clickedTile.x * game.tileSize,
            y: clickedTile.y * game.tileSize,
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