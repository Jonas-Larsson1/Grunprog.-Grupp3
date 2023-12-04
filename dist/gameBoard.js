export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    const gameBoard = []
    const boardWidth = canvasWidth / tileSize
    const boardHeight = canvasHeight / tileSize

    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            gameBoard.push({
                x,
                y,
                path: Math.round(Math.random())
            })
        }
    }
    return gameBoard
}

export const drawGameBoard = (ctx, game) => {
    const tileSize = game.tileSize
    const board = game.board
    for (let i = 0; i < board.length; i++) {
        let currentTile = board[i]
        if (currentTile.path === 1) {
            ctx.fillStyle = 'green';
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize);
        }
    }
}