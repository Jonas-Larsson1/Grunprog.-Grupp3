export const addHitEffect = (game, x, y, color, radius) => {
    game.hitEffects.push({ x, y, color, radius, duration: 60 });
}

export const drawHitEffects = (ctx, game) => {
    game.hitEffects.forEach((effect, index) => {
        ctx.fillStyle = effect.color;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        effect.radius *= 0.9 - game.deltaTime

        effect.duration -= game.deltaTime

        if (effect.duration <= 0) {
            game.hitEffects.splice(index, 1);
        }
    })
}