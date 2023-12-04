const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  startGame()
})

let lastTick, 
currentTick, 
deltaTime

canvas.width = 640
canvas.height = 640

const startGame = () => {
    lastTick = Date.now();
    requestAnimationFrame(tick)
}

const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    currentTick = Date.now()
    deltaTime = (currentTick - lastTick) / 1000
    lastTick = currentTick

    requestAnimationFrame(tick)
}

    