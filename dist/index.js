import { generateGameBoard, drawGameBoard } from './gameBoard.js';

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
    requestAnimationFrame(() => {
        tick(ctx, game)
    })

    return {
        tileSize,
        width,
        height,

        board: generateGameBoard(tileSize, width, height),

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

    requestAnimationFrame(() => {
        tick(ctx, game)
    })
}

    