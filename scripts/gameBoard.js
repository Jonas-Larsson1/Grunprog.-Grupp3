
export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    let allTiles = []
    const boardWidth = canvasWidth / tileSize
    const boardHeight = canvasHeight / tileSize

    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            allTiles.push({
                x,
                y,
                path: false,
                selected: false,
                special: '',
                direction: ''
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
                    { x: tile.x + 1, y: tile.y, position: 'east' },
                    { x: tile.x - 1, y: tile.y, position: 'west' },
                    { x: tile.x, y: tile.y + 1, position: 'south' },
                    { x: tile.x, y: tile.y - 1, position: 'north' },
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

    console.log(allTiles.filter(tile => tile.path === true));
    console.log(pathTiles)

    allTiles = calculateTileDirection(allTiles, pathTiles, boardWidth)

    console.log(allTiles.filter(tile => tile.path === true))

    return {
        allTiles,
        startTile,
        exitTile,
        pathTiles
    }
}

const calculateTileDirection = (allTiles, pathTiles, boardWidth) => {
    // const allTilesWithPath = allTiles.filter(tile => tile.path === true)
    // console.log(allTilesWithPath)

    for (let i = 0; i < pathTiles.length; i++) {
        const currentTile = pathTiles[i]
        const tileToChange = allTiles[currentTile.y * boardWidth + currentTile.x]

        if (i > 0) {
        //   const previousTile = pathTiles[i - 1]
          tileToChange.direction += `${currentTile.position}`
        }
      
        if (i < pathTiles.length - 1) {
          const nextTile = pathTiles[i + 1]
          tileToChange.direction += `-${nextTile.position}`
        }
    }

    return allTiles
}
  
export const drawGameBoard = (ctx, game) => {
    const tileSize = game.tileSize
    const allTiles = game.allTiles
    for (let i = 0; i < allTiles.length; i++) {
        let currentTile = allTiles[i]
        let sprite = game.pathSprite

        switch (currentTile.direction) {
            case 'north-east':
            case 'west-south':
                sprite = game.southEastSprite
                break
            case 'north-west':
            case 'east-south':
                sprite = game.southWestSprite
                break
            case 'south-east':
            case 'west-north':
                sprite = game.northEastSprite
                break
            case 'south-west':
            case 'east-north':
                sprite = game.northWestSprite
                break
            case 'north-north':
            case 'south-south':
                sprite = game.northSouthSprite
                break
            case 'east-east':
            case 'west-west':
                sprite = game.westEastSprite
                break
        }

        if (currentTile.special === 'start') {
            sprite = game.startSprite
        } else if (currentTile.special === 'exit') {
            sprite = game.exitSprite
        }

        if (currentTile.special === 'start') {
            ctx.fillStyle = 'lightgreen'
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize )
        } else if (currentTile.special === 'exit') {
            ctx.fillStyle = 'coral'
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize )
        } else {
            ctx.fillStyle = 'grey'
            ctx.fillRect(currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize )
        }

        if (currentTile.path) {
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(sprite, currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize)
        }

        if (currentTile.selected) {
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 2
            ctx.strokeRect(currentTile.x * game.tileSize, currentTile.y * game.tileSize, tileSize - 2, tileSize - 2)
        }
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