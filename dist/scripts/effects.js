export const addHitEffect = (game, x, y, color, radius) => {
    game.hitEffects.push({ x, y, color, radius, duration: 1 })
}

export const addMessage = (game, x, y, color, message, sprite) => {
    game.messages.push({ x, y, color, message, sprite, duration: 1 })
}

export const drawMessages = (ctx, game) => {
    game.messages.forEach((message, index) => {
        ctx.fillStyle = message.color
        ctx.font = `${game.tileSize / 4}px monospace`
        ctx.fillText(message.message, message.x, message.y)

        if (message.sprite) {
            ctx.drawImage(message.sprite, message.x + game.tileSize / 3, message.y - game.tileSize / 5, game.tileSize / 4, game.tileSize / 4)
        }

        message.y -= (game.deltaTime * 15)
        message.duration -= game.deltaTime

        if (message.duration <= 0) {
            game.messages.splice(index, 1)
        }
    })
}

export const drawHitEffects = (ctx, game) => {
    game.hitEffects.forEach((effect, index) => {
        ctx.fillStyle = effect.color
        ctx.beginPath()
        ctx.arc(effect.x, effect.y, effect.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()

        effect.radius *= 0.9 - game.deltaTime

        effect.duration -= game.deltaTime

        if (effect.duration <= 0) {
            game.hitEffects.splice(index, 1)
        }
    })
}