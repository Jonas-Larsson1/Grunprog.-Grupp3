export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    let allTiles = []
    const boardWidth = canvasWidth / tileSize
    const boardHeight = canvasHeight / tileSize

    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            const isOnEdge = y === 0 || y === boardHeight - 1
            allTiles.push({
                x,
                y,
                path: false,
                selected: false,
                special: isOnEdge ? 'border' : '',
                direction: ''
            })
        }
    }

    let startTile = {
        x: Math.floor(Math.random() * (boardWidth - 1)) + 1,
        y: Math.floor(Math.random() * ((boardHeight - 1) - 1)) + 1
    }

    const pathTilesToGenerate = (boardHeight * boardWidth) / 2

    let currentTile = startTile
    let visitedTiles = []
    let pathTiles = []

    for (let n = 0; n < pathTilesToGenerate; n++) {
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
                adjTile.x >= 1 &&
                adjTile.x < boardWidth - 1 &&
                adjTile.y >= 2 &&
                adjTile.y < boardHeight - 2
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

    allTiles = calculateTileDirection(allTiles, pathTiles, boardWidth)

    const pathCoordinates = pathTiles.map(tile => ({
        x: (tile.x * tileSize) + (tileSize / 4),
        y: (tile.y * tileSize) + (tileSize / 4)
    }))

    const allTileCoordinates = allTiles.map(tile => {
        return { x: tile.x * tileSize, y: tile.y * tileSize, path: tile.path, special: tile.special }
    })

    return {
        allTiles,
        startTile,
        exitTile,
        pathTiles,
        pathCoordinates,
        allTileCoordinates
    }
}

const calculateTileDirection = (allTiles, pathTiles, boardWidth) => {

    for (let i = 0; i < pathTiles.length; i++) {
        const currentTile = pathTiles[i]
        const tileToChange = allTiles[currentTile.y * boardWidth + currentTile.x]

        if (i > 0) {
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
        let sprite = game.tileSprite

        if (currentTile.path) {
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
        }

        if (currentTile.special === 'start') {
            switch (currentTile.direction) {
                case '-north':
                    sprite = game.startNorthSprite
                    break
                case '-east':
                    sprite = game.startEastSprite
                    break
                case '-south':
                    sprite = game.startSouthSprite
                    break
                case '-west':
                    sprite = game.startWestSprite
                    break
            }
        } else if (currentTile.special === 'exit') {
            switch (currentTile.direction) {
                case 'south':
                    sprite = game.exitNorthSprite
                    break
                case 'west':
                    sprite = game.exitEastSprite
                    break
                case 'north':
                    sprite = game.exitSouthSprite
                    break
                case 'east':
                    sprite = game.exitWestSprite
                    break
            }
        }

        if (currentTile.special === 'border') {
            sprite = game.borderSprite
        }

        ctx.imageSmoothingEnabled = false
        ctx.drawImage(sprite, currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize)

        if (currentTile.selected) {
            if (currentTile.special === '') {

                let timerDecimal = game.timer % 1
                if (timerDecimal <= 0.25) {
                    sprite = game.arrow1Sprite
                } else if (timerDecimal <= 0.50) {
                    sprite = game.arrow2Sprite
                } else if (timerDecimal <= 0.75) {
                    sprite = game.arrow3Sprite
                } else {
                    sprite = game.arrow4Sprite
                }

                ctx.imageSmoothingEnabled = false
                ctx.drawImage(sprite, (currentTile.x * game.tileSize) + (game.tileSize / 4), (currentTile.y * game.tileSize) + (game.tileSize / 8), tileSize / 2, tileSize / 2)
            }
            ctx.strokeStyle = '#cae6f5'
            ctx.lineWidth = 2
            ctx.setLineDash([game.tileSize / 24, game.tileSize / 8])
            ctx.strokeRect((currentTile.x * game.tileSize) + (game.tileSize / 6), (currentTile.y * game.tileSize) + (game.tileSize / 6), tileSize / 1.5, tileSize / 1.5)
        }
    }

    game.towers.forEach((tower) => {
        let sprite

        switch (tower.upgrade) {
            case 1:
                sprite = game.tower1Sprite
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.tower1Fire1Sprite
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.tower1Fire2Sprite
                }
                break

            case 2:
                sprite = game.tower2Sprite
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.tower2Fire1Sprite
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.tower2Fire2Sprite
                }
                break

            case 3:
                ctx.filter = 'invert(100%)'
                sprite = game.tower2Sprite
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.tower2Fire1Sprite
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.tower2Fire2Sprite
                }
                break

            default:
                sprite = game.tower1Sprite
        }

        ctx.imageSmoothingEnabled = false
        ctx.drawImage(sprite, tower.x, tower.y, tower.size, tower.size)
        ctx.filter = 'none'
    })

    game.bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color
        ctx.beginPath()
        ctx.arc(bullet.x, bullet.y, bullet.size / 2, 0, 2 * Math.PI)
        ctx.fill()
    })
}