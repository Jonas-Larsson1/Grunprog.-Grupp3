export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    const gameBoard = []
    const boardWidth = canvasWidth / tileSize
    const boardHeight = canvasHeight / tileSize

    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            gameBoard.push({
                x,
                y,
                path: false,
            })
        }
    }

    const startTile = { x: 0, y: 1 }
    const exitTile = { x: boardWidth - 1, y: boardHeight - 2}

    let currentTile = { x: 0, y: 1 }
    let visitedTiles = []

    
    // while (currentTile.x !== boardWidth -1) {
    for (let n = 0; n < 50; n++) {
        gameBoard[currentTile.y * boardWidth + currentTile.x].path = true
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
                if (gameBoard[adjTile.y * boardWidth + adjTile.x].path) {
                    adjPathCount++
                }
            }
        
            return adjPathCount <= 1
        };
        
        const potentialTiles = validAdjacentTiles(currentTile).filter(adjTile => {
            return (
                !visitedTiles.some(visitedTile => visitedTile === `${adjTile.x},${adjTile.y}`) &&
                !gameBoard[adjTile.y * boardWidth + adjTile.x].path &&
                isValidTile(adjTile)
            );
        });

        // const isValidTile = (tile) => {

        //     const adjacentTiles = validAdjacentTiles(tile)

        //     let adjPathCount = 0

        //     for (tile of adjacentTiles) {
        //         if (gameBoard[tile.y * boardWidth + tile.x].path) {
        //             adjPathCount++
        //         }
        //     }

        //     if (adjPathCount > 1) {

        //         return false
        //     } else {

        //         return true
        //     }

        // } 

        // const potentialTiles = validAdjacentTiles(currentTile).filter(adjTile => {
        //     !visitedTiles.some(visitedTile => {
        //         visitedTile === `${adjTile.x},${adjTile.y}`
        //     }) &&
        //     !gameBoard[adjTile.y * boardWidth + adjTile.x].path && 
        //     isValidTile(adjTile)
        // })
        
        // const potentialTiles = validAdjacentTiles(currentTile).filter(adjTile =>
        //     !visitedTiles.some(visitedTile => 
        //         visitedTile ===`${adjTile.x},${adjTile.y}`) &&
        //     !gameBoard[adjTile.y * boardWidth + adjTile.x].path && 
        //     validAdjacentTiles(adjTile).filter(nextAdjTile => 
        //         !gameBoard[nextAdjTile.y * boardWidth + nextAdjTile.x].path
        //     )
        // )

        if (potentialTiles.length > 0) {
            const nextTile = potentialTiles[Math.floor(Math.random() * potentialTiles.length)] 
            currentTile = nextTile
        } else {
            const previousTile = visitedTiles.pop()
            currentTile = previousTile
        }
    }

    return gameBoard
}

export const drawGameBoard = (ctx, game) => {
    const tileSize = game.tileSize
    const board = game.board
    for (let i = 0; i < board.length; i++) {
        let currentTile = board[i]
        if (currentTile.path) {
            ctx.fillStyle = 'green';
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize);
        } else {
            ctx.fillStyle = 'grey';
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize);
        }
    }
}