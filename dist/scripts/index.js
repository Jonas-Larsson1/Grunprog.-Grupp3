import { generateGameBoard, drawGameBoard } from './gameBoard.js'
import { drawEnemies, enemySpawnTimer, updateEnemies } from './enemies.js'
import { clickTile } from './selectTile.js'
import { updateTowers, removeTower, spawnTower } from './towers.js'
import { updateBullets } from './bullets.js'
import { drawHitEffects } from './effects.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const towerSpawn = document.getElementById('towerSpawn')
const towerRemove = document.getElementById('towerRemove')

const playerHealthElement = document.getElementById('healthValue')
const playerMoneyElement = document.getElementById('moneyValue')
const towerCostElement = document.getElementById('towerCostValue')
const enemiesKilledElement = document.getElementById('enemyKillValue')

// const maxTileSize = 100
// const tilesInWidth = Math.floor(window.innerWidth / maxTileSize)
// const tilesInHeight = Math.floor(window.innerHeight / maxTileSize)
const tilesInWidth = 16
const tilesInHeight = 10
const tileSize = Math.floor(window.innerWidth / tilesInWidth)

canvas.width = tilesInWidth * tileSize
canvas.height = tilesInHeight * tileSize  

let game;

window.addEventListener('DOMContentLoaded', () => {
    if (!game) {
        game = startGame(tileSize, canvas.width, canvas.height, canvas)

        game.tileSprite.src = './sprites/tile.png'
        game.borderSprite.src = './sprites/border.png'

        game.startNorthSprite.src = './sprites/start-north.png'
        game.startEastSprite.src = './sprites/start-east.png'
        game.startSouthSprite.src = './sprites/start-south.png'
        game.startWestSprite.src = './sprites/start-west.png'

        game.exitNorthSprite.src = './sprites/exit-north.png'
        game.exitEastSprite.src = './sprites/exit-east.png'
        game.exitSouthSprite.src = './sprites/exit-south.png'
        game.exitWestSprite.src = './sprites/exit-west.png'
        
        game.northEastSprite.src = './sprites/north-east.png'
        game.northWestSprite.src = './sprites/north-west.png'
        game.northSouthSprite.src = './sprites/north-south.png'
        game.southEastSprite.src = './sprites/south-east.png'
        game.southWestSprite.src = './sprites/south-west.png'
        game.westEastSprite.src = './sprites/west-east.png'

        game.skull1Sprite.src = './sprites/skull-1.png'
        game.skull2Sprite.src = './sprites/skull-2.png'
        game.skull3Sprite.src = './sprites/skull-3.png'
        game.skull4Sprite.src = './sprites/skull-4.png'

        game.towerSprite.src = './sprites/tower.png'        
        game.towerFire1Sprite.src = './sprites/tower-fire1.png'        
        game.towerFire2Sprite.src = './sprites/tower-fire2.png'        
    }
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
        game.clickedTile = clickTile(event, game, canvas)
        console.log(game.clickedTile)
        if (game.clickedTile && game.clickedTile.special === '') {
            towerSpawn.style.display = 'block'
            towerRemove.style.display = 'none'
        } else if (game.clickedTile && game.clickedTile.special === 'tower') {
            towerRemove.style.display = 'block'
            towerSpawn.style.display = 'none'
        } else {
            towerSpawn.style.display = 'none'
        }
    })

    towerSpawn.addEventListener('click', () => {
        if (game.playerMoney >= game.towerCost) {
            spawnTower(clickTile(null, game, null), game)
            game.playerMoney -= game.towerCost
            game.towerCost *= 1.25
            game.towerCost = Math.floor(game.towerCost)
            towerSpawn.style.display = 'none'
        }
    })

    towerRemove.addEventListener('click', () => {
        if (removeTower(clickTile(null, game, null), game)) {
            game.playerMoney += 10
        }
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
        enemySpawnInterval: 2,
        enemyIntervalTimer: 10,
        enemiesKilled: 0,

        towers: [],
        towerCost: 10,
        bullets: [],
        hitEffects: [],

        playerHealth: 5,
        playerMoney: 20,

        tileSprite: new Image(),
        borderSprite: new Image(),

        startNorthSprite: new Image(),
        startEastSprite: new Image(),
        startSouthSprite: new Image(),
        startWestSprite: new Image(),

        exitNorthSprite: new Image(),
        exitEastSprite: new Image(),
        exitSouthSprite: new Image(),
        exitWestSprite: new Image(),

        northEastSprite: new Image(),
        northWestSprite: new Image(),
        northSouthSprite: new Image(),
        southEastSprite: new Image(),
        southWestSprite: new Image(),
        westEastSprite: new Image(),

        skull1Sprite: new Image(),
        skull2Sprite: new Image(),
        skull3Sprite: new Image(),
        skull4Sprite: new Image(),

        towerSprite: new Image(),
        towerFire1Sprite: new Image(),
        towerFire2Sprite: new Image(),
        
        isPaused: false,
        clickedTile: {}, 
        timer: 0, 

        lastTick: Date.now(),
        deltaTime: 0
    }
}

const tick = (ctx, game) => {
    if (game.playerHealth > 0) {
        let currentTick = Date.now()
        game.deltaTime = (currentTick - game.lastTick) / 1000
        game.lastTick = currentTick
        if (!game.isPaused) {
            game.timer += game.deltaTime
            ctx.clearRect(0, 0, game.width, game.height)
            
            drawGameBoard(ctx, game)
            drawEnemies(ctx, game)
            drawHitEffects(ctx, game)

            updateEnemies(game)
            updateTowers(game)
            updateBullets(game)
            enemySpawnTimer(game)
            
            playerHealthElement.textContent = game.playerHealth
            playerMoneyElement.textContent = game.playerMoney
            towerCostElement.textContent = game.towerCost
            enemiesKilledElement.textContent = game.enemiesKilled
        }
        
        requestAnimationFrame(() => {
            tick(ctx, game)
        })

    } else {
        gameOver()
    }
}

const gameOver = () => {
    alert('You lost!')
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