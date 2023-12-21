export const initSpriteArray = (stringArray) => {
    const spriteArray = {}
    stringArray.forEach((spriteName) => {
        spriteArray[spriteName] = new Image()
    })
    return spriteArray
}

export const setSpriteSrc = (spriteArray) => {
    Object.keys(spriteArray).forEach((spriteName) => {
        spriteArray[spriteName].src = `./sprites/${spriteName}.png`
    })
}