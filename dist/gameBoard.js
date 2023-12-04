export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    const allTiles = []
    const boardWidth = canvasWidth / tileSize
    const boardHeight = canvasHeight / tileSize

    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            allTiles.push({
                x,
                y,
                path: false,
                special: ''
            })
        }
    }

    const startTile = { 
        x: Math.floor(Math.random() * boardWidth),
        y: Math.floor(Math.random() * boardHeight),
    }

    const pathsTilesToGenerate = (boardHeight * boardWidth) / 2

    let currentTile = startTile
    let visitedTiles = []
    
    for (let n = 0; n < pathsTilesToGenerate; n++) {
        allTiles[currentTile.y * boardWidth + currentTile.x].path = true
        visitedTiles.push(currentTile)

        const validAdjacentTiles = (tile) => {
            const allAdjacentTiles = ([
                    { x: tile.x + 1, y: tile.y },
                    { x: tile.x - 1, y: tile.y },
                    { x: tile.x, y: tile.y + 1 },
                    { x: tile.x, y: tile.y - 1 },
                ])

            return allAdjacentTiles.filter(adjTile =>
                    adjTile.x >= 0 &&
                    adjTile.x < boardWidth &&
                    adjTile.y >= 0 && 
                    adjTile.y < boardHeight
            )
        }

        const isValidTile = (tile) => {
            const adjacentTiles = validAdjacentTiles(tile);
            let adjPathCount = 0
        
            for (const adjTile of adjacentTiles) {
                if (allTiles[adjTile.y * boardWidth + adjTile.x].path) {
                    adjPathCount++
                }
            }
        
            return adjPathCount <= 1
        };
        
        const potentialTiles = validAdjacentTiles(currentTile).filter(adjTile => {
            return (
                !visitedTiles.some(visitedTile => visitedTile === `${adjTile.x},${adjTile.y}`) &&
                !allTiles[adjTile.y * boardWidth + adjTile.x].path &&
                isValidTile(adjTile)
            )
        })

        if (potentialTiles.length > 0) {
            const nextTile = potentialTiles[Math.floor(Math.random() * potentialTiles.length)] 
            currentTile = nextTile
        } else {
            const previousTile = visitedTiles.pop()
            currentTile = previousTile
        }
    }

    allTiles[startTile.y * boardWidth + startTile.x].special = 'start'
    allTiles[currentTile.y * boardWidth + currentTile.x].special = 'exit'

    return allTiles
}

export const drawGameBoard = (ctx, game) => {
    const tileSize = game.tileSize
    const board = game.board
    for (let i = 0; i < board.length; i++) {
        let currentTile = board[i]
        if (currentTile.path && currentTile.special === '') {
            ctx.fillStyle = 'silver';
        } else if (currentTile.special === 'start') {
            ctx.fillStyle = 'lightgreen'
        } else if (currentTile.special === 'exit') {
            ctx.fillStyle = 'coral'
        } else {
            ctx.fillStyle = 'grey';
        }
        ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize);
    }
}