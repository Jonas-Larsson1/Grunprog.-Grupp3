import { generateGameBoard, drawGameBoard } from './gameBoard.js'
import { drawEnemies, enemySpawnTimer, updateEnemies } from './enemies.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const startButton = document.getElementById('start')

const tileSize = 64
canvas.width = tileSize * 8
canvas.height = tileSize * 8   

let game

startButton.addEventListener('click', () => {
    game = startGame(tileSize, canvas.width, canvas.height)
})

const startGame = (tileSize, width, height) => {
    const gameBoard = generateGameBoard(tileSize, width, height)
    const pathCoordinates = gameBoard.pathTiles.map(tile => ({
        x: (tile.x * tileSize) + (tileSize / 4),
        y: (tile.y * tileSize) + (tileSize / 4)
    }))

    requestAnimationFrame(() => {
        tick(ctx, game)
    })

    return {
        tileSize,
        width,
        height,
        allTiles: gameBoard.allTiles,
        startTile: gameBoard.startTile,
        exitTile: gameBoard.exitTile,

        path: pathCoordinates,

        enemies: [],
        enemySpawnTimer: 2,

        lastTick: Date.now(),
        deltaTime: 0
    }
}

const tick = (ctx, game) => {
    ctx.clearRect(0, 0, game.width, game.height)

    let currentTick = Date.now()
    game.deltaTime = (currentTick - game.lastTick) / 1000
    game.lastTick = currentTick

    drawGameBoard(ctx, game)
    drawEnemies(ctx, game)

    updateEnemies(game)

    enemySpawnTimer(game)

    requestAnimationFrame(() => {
        tick(ctx, game)
    })
}

    