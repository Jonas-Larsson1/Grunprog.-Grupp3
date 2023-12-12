import { generateGameBoard, drawGameBoard } from './gameBoard.js'
import { drawEnemies, enemySpawnTimer, updateEnemies } from './enemies.js'
import { clickTile } from './selectTile.js'
import { updateTowers, removeTower, spawnTower } from './towers.js'
import { updateBullets } from './bullets.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const startButton = document.getElementById('start')
const towerSpawn = document.getElementById('towerSpawn')
const towerRemove = document.getElementById('towerRemove')
const playerHealthElement = document.getElementById('playerHealth')

const tileSize = 64
canvas.width = tileSize * 8
canvas.height = tileSize * 8   

let game;

startButton.addEventListener('click', () => {
    game = startGame(tileSize, canvas.width, canvas.height, canvas)
})

const startGame = (tileSize, width, height, canvas) => {
    const gameBoard = generateGameBoard(tileSize, width, height)
    const pathCoordinates = gameBoard.pathTiles.map(tile => ({
        x: (tile.x * tileSize) + (tileSize / 4),
        y: (tile.y * tileSize) + (tileSize / 4)
    }))

    const allTileCoordinates = gameBoard.allTiles.map(tile => {
        return { x: tile.x * tileSize, y: tile.y * tileSize, path: tile.path, special: tile.special }
    })

    canvas.addEventListener('click', (event) => {
        clickTile(event, game, canvas)
    })

    towerSpawn.addEventListener('click', () => {
        spawnTower(clickTile(null, game, null), game)
    })
    towerRemove.addEventListener('click', () => {
        removeTower(clickTile(null, game, null), game)
    })

    window.addEventListener('blur', () => {
        game.isPaused = true
    }) 

    window.addEventListener('focus', () => {
        game.isPaused = false
    }) 

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
        allTileCoordinates: allTileCoordinates, 

        enemies: [],
        enemySpawnTimer: 2,

        towers: [],
        bullets: [],

        playerHealth: 5, 
        isPaused: false, 

        lastTick: Date.now(),
        deltaTime: 0
    }
}

const tick = (ctx, game) => {
    let currentTick = Date.now()
    game.deltaTime = (currentTick - game.lastTick) / 1000
    game.lastTick = currentTick
    if (!game.isPaused) {
        ctx.clearRect(0, 0, game.width, game.height)
        
        drawGameBoard(ctx, game)
        drawEnemies(ctx, game)
        updateEnemies(game)
        updateTowers(game)
        updateBullets(game)
        enemySpawnTimer(game)
    }

    requestAnimationFrame(() => {
        tick(ctx, game)
    })
}


// //  <<< Alternativ paus lösning >>>

// // pause och unpause
// let isPaused = false;
// let unpauseDelay = 20; 
// let unpauseTimeout;
// let pauseStartTime;
// let pausedTime = 0;

// // fiendernas urspurngliga positioner under uppehåll 
// let initialEnemyPositions = [];


// window.addEventListener('blur', function(){
//     isPaused = true;
//     pauseStartTime = Date.now();
//     initialEnemyPositions = game.enemies.map(enemy => ({ x: enemy.x, y: enemy.y }));
// });

// window.addEventListener('focus', function(){
//     clearTimeout(unpauseTimeout);

//     // unpause after delay 
//     unpauseTimeout = setTimeout(() => {
//         isPaused = false;
//         pausedTime += Date.now() - pauseStartTime;

//         // fiendernas positioner baserad på en paus
//         game.enemies.forEach((enemy, index) => {
//             const initialPosition = initialEnemyPositions[index];
//             if (initialPosition) {
//                 const elapsedTime = pausedTime / 1000; 
//                 const speed = enemy.vel;
//                 enemy.x = initialPosition.x + elapsedTime * speed;
//                 enemy.y = initialPosition.y;
//             }
//         });

//         // tidsåterställning
//         pausedTime = 0;

//         requestAnimationFrame(() => tick(ctx, game));
//     }, unpauseDelay);
// });