export const clickTile = (event, game, canvas) => {
    let oldSelectedTile

    game.allTiles.forEach((tile, index) => {
        if (tile.selected) {
            oldSelectedTile = game.allTiles[index]
            tile.selected = !tile.selected
        }
    })

    // Om vi inte skickar in event och canvas får vi ut den tidigare valda tilen
    // annars får vi ut den nya vi klickar på
    if (event && canvas) {

        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const tileX = Math.floor(x / game.tileSize)
        const tileY = Math.floor(y / game.tileSize)

        const tileToChange = game.allTiles.findIndex((tile) => tile.x === tileX && tile.y === tileY)

        const newSelectedTile = game.allTiles[tileToChange]

        if (!newSelectedTile.path && newSelectedTile.special !== 'border') {
            newSelectedTile.selected = !newSelectedTile.selected
            return newSelectedTile
        } else {
            return false
        }
    }

    return oldSelectedTile
}