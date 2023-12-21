export const generateGameBoard = (tileSize, canvasWidth, canvasHeight) => {
    // Vi säger att brädan ej är valid så att om t.ex. längden på path blir för kort 
    // så generas en ny omedelbart
    let validBoard = false 
    while (!validBoard) {
        let allTiles = []
        // boardWidth och boardHeight blir våra högsta x,y kordinater längst ner till höger
        const boardWidth = canvasWidth / tileSize
        const boardHeight = canvasHeight / tileSize
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth; x++) {
                // Border tile runt hela brädan
                // const isOnEdge = x === 0 || x === boardWidth - 1 || y === 0 || y === boardHeight - 1;

                // Border tile endast nere och uppe
                const isOnEdge = y === 0 || y === boardHeight - 1;
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

        // Starten blir en random tile som är har en tile marginal från sidorna och
        // 2 tiles in på höjden för att kompensera för våran border tile
        let startTile = { 
            x: Math.floor(Math.random() * (boardWidth - 1)) + 1,
            y: Math.floor(Math.random() * ((boardHeight - 1) - 1)) + 1,
        }

        // Vi begränsar hur många steg algoritmen kommer ta för att skapa en path,
        // Den slutgiltiga längden på path vet vi ej i förväg
        const pathsTilesToGenerate = (boardHeight * boardWidth) / 2

        let currentTile = startTile
        let visitedTiles = []
        let pathTiles = []
        
        for (let n = 0; n < pathsTilesToGenerate; n++) {
            // Vi behandlar våran 1D array som ett 2D grid för att veta vilken
            // Tile vi ska välja, I detta fall för att säga att tilen vi
            // 'står' ska vara en path tile
            // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
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
                // Vi filtrerar alla intilligande tiles från dom som är innanför
                // 1 tile från sidorna och 2 på höjden
                return allAdjacentTiles.filter(adjTile =>
                        adjTile.x >= 1 &&
                        adjTile.x < boardWidth - 1 &&
                        adjTile.y >= 2 && 
                        adjTile.y < boardHeight - 2
                )
            }

            // isValidTile() kollar om en tile ligger bredvid mer än 1 path tile
            // Den gör så att vi alltid har minst en tom tile mellan två path tiles
            // förutom på diagonalen
            const isValidTile = (tile) => {
                const adjacentTiles = validAdjacentTiles(tile);
                let adjPathCount = 0
                
                for (const adjTile of adjacentTiles) {
                    if (allTiles[adjTile.y * boardWidth + adjTile.x].path) {
                        // Om man tar bort ++ från raden nedanför så kan man få gångarna att ligga bredvid varandra
                        adjPathCount++
                    }
                }
            
                return adjPathCount <= 1
            };

            // Alla potentiella tiles som vi kan gå till härnäst, 
            // med ogiltilga tiles borttagna.
            // En tile är giltig endast om isValidTile() är true och den inte redan har en path
            const potentialTiles = validAdjacentTiles(currentTile).filter(adjTile => {
                return (
                    !visitedTiles.some((vt) => vt.x === adjTile.x && vt.y === adjTile.y) &&
                    !allTiles[adjTile.y * boardWidth + adjTile.x].path &&
                    isValidTile(adjTile)
                ) 
            })

            // Om vi har minst en potentiel tile att gå vidare till så väljer vi en av dem slumpmässigt, 
            // annars går vi tillbaka ett steg 
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

        // vi räknar ut pixel kordinater till centrum av alla tiles,
        // oanvänd i nuläget 
        const pathCoordinates = pathTiles.map(tile => ({
            x: (tile.x * tileSize) + (tileSize / 4),
            y: (tile.y * tileSize) + (tileSize / 4)
        }))

        const allTileCoordinates = allTiles.map(tile => {
            return { x: tile.x * tileSize, y: tile.y * tileSize, path: tile.path, special: tile.special }
        })

        // Om längden på path är mer än 2 så returnernar vi den färdiga brädan
        // annars fortsätter loopen och genererar en ny
        if (pathTiles.length > 2) {
            validBoard = true
            return {
                allTiles,
                startTile,
                exitTile,
                pathTiles,
                pathCoordinates,
                allTileCoordinates
            }
        }
    }
}

const calculateTileDirection = (allTiles, pathTiles, boardWidth) => {
    for (let i = 0; i < pathTiles.length; i++) {
        const currentTile = pathTiles[i]
        const tileToChange = allTiles[currentTile.y * boardWidth + currentTile.x]

        // riktningen fiender går in i en tile
        if (i > 0) {
            tileToChange.direction += `${currentTile.position}`
        }

        // riktningen fiender går ut ur en tile
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
        let sprite = game.sprites.tile

        // Om våran tile har en path så vill vi kolla hur fiender går in och ut ur den
        // för att välja vilken sprite vi ska använda
        if (currentTile.path) {
            switch (currentTile.direction) {
                case 'north-east':
                case 'west-south':
                    sprite = game.sprites.southEast
                    break
                case 'north-west':
                case 'east-south':
                    sprite = game.sprites.southWest
                    break
                case 'south-east':
                case 'west-north':
                    sprite = game.sprites.northEast
                    break
                case 'south-west':
                case 'east-north':
                    sprite = game.sprites.northWest
                    break
                case 'north-north':
                case 'south-south':
                    sprite = game.sprites.northSouth
                    break
                case 'east-east':
                case 'west-west':
                    sprite = game.sprites.westEast
                    break
            }
        }

        // start har endast utgång och ingen ingång
        // exit har endast ingång och ingen utgång
        if (currentTile.special === 'start') {
            switch (currentTile.direction) {
                case '-north':
                    sprite = game.sprites.startNorth
                    break
                case '-east':
                    sprite = game.sprites.startEast
                    break
                case '-south':
                    sprite = game.sprites.startSouth
                    break
                case '-west':
                    sprite = game.sprites.startWest
                    break
            }
        } else if (currentTile.special === 'exit') {
            switch (currentTile.direction) {
                case 'south':
                    sprite = game.sprites.exitNorth
                    break
                case 'west':
                    sprite = game.sprites.exitEast
                    break
                case 'north':
                    sprite = game.sprites.exitSouth
                    break
                case 'east':
                    sprite = game.sprites.exitWest
                    break
            }
        }

        if (currentTile.special === 'border') {
            sprite = game.sprites.border
        }

        // imageSmoothingEnabled måste stängas av för pixelart, annars blir det suddigt
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(sprite, currentTile.x * tileSize, currentTile.y * tileSize, tileSize, tileSize)

        // en animation som går mellan 4 olika sprites varje sekund
        if (currentTile.selected) {
            if (currentTile.special === '') {
                let timerDecimal = game.timer % 1
                if (timerDecimal <= 0.25) {
                    sprite = game.sprites.arrow1
                } else if (timerDecimal <= 0.50) {
                    sprite = game.sprites.arrow2
                } else if (timerDecimal <= 0.75) {
                    sprite = game.sprites.arrow3
                } else {
                    sprite = game.sprites.arrow4
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

        // olika grafik beroende på tower upgraderingsnivå och om den ska precis attackera
        switch (tower.upgrade) {
            case 1:
                sprite = game.sprites.tower1
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.sprites.tower1Fire1
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.sprites.tower1Fire2
                }
                break

            case 2:
                sprite = game.sprites.tower2
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.sprites.tower2Fire1
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.sprites.tower2Fire2
                }
                break

            case 3:
                ctx.filter = 'invert(100%)'
                sprite = game.sprites.tower2
                if (tower.attackCooldown <= 0.1) {
                    sprite = game.sprites.tower2Fire1
                } else if (tower.attackCooldown <= 0.05) {
                    sprite = game.sprites.tower2Fire2
                }
                break

            default:
                sprite = game.sprites.tower1
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