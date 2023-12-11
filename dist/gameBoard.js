
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
                selected: false,
                special: ''
            })
        }
    }

    let startTile = { 
        x: Math.floor(Math.random() * boardWidth),
        y: Math.floor(Math.random() * boardHeight),
    }

    const pathsTilesToGenerate = (boardHeight * boardWidth) / 2

    let currentTile = startTile
    let visitedTiles = []
    let pathTiles = []
    
    for (let n = 0; n < pathsTilesToGenerate; n++) {
        allTiles[currentTile.y * boardWidth + currentTile.x].path = true
        visitedTiles.push(currentTile)
        pathTiles.push(currentTile)

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
                !visitedTiles.some((vt) => vt.x === adjTile.x && vt.y === adjTile.y) &&
                !allTiles[adjTile.y * boardWidth + adjTile.x].path &&
                isValidTile(adjTile)
            ) 
        })

        if (potentialTiles.length > 0) {
            const nextTile = potentialTiles[Math.floor(Math.random() * potentialTiles.length)] 
            currentTile = nextTile
        } else {
            const previousTile = pathTiles.pop()
            currentTile = previousTile
        }
    }

    pathTiles.push(currentTile)
    startTile = allTiles[startTile.y * boardWidth + startTile.x]
    let exitTile = allTiles[currentTile.y * boardWidth + currentTile.x]

    startTile.special = 'start'
    exitTile.special = 'exit'

    return {
        allTiles,
        startTile,
        exitTile,
        pathTiles
    }
}
 
export const drawGameBoard = (ctx, game) => {
    const tileSize = game.tileSize
    const allTiles = game.allTiles
    for (let i = 0; i < allTiles.length; i++) {
        let currentTile = allTiles[i]
        if (currentTile.path && currentTile.special === '') {
            ctx.fillStyle = 'silver'
        } else if (currentTile.special === 'start') {
            ctx.fillStyle = 'lightgreen'
        } else if (currentTile.special === 'exit') {
            ctx.fillStyle = 'coral'
        } else if (currentTile.selected) {
            ctx.fillStyle = 'red'
        } else {
            ctx.fillStyle = 'grey'
        }
        ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize)
    }

    game.towers.forEach((tower) => {
        ctx.fillStyle = 'orange'; 
        ctx.fillRect(tower.x, tower.y, tower.size, tower.size);
    });

    game.bullets.forEach((bullet) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    });
}