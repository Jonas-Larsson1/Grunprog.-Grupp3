export const clickTile = (event, game, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const tileX = Math.floor(x / game.tileSize)
    const tileY = Math.floor(y / game.tileSize)

    const tileToChange = game.allTiles.findIndex((tile) => tile.x === tileX && tile.y === tileY)
    
    if (game.allTiles[tileToChange].special === '' && !game.allTiles[tileToChange].path) {
        game.allTiles[tileToChange].special = 'clicked'
    }
}