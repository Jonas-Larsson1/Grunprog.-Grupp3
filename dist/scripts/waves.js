/*
const waveMessage = (message) => {
    var waveText = document.createElement("div");
  
    waveText.id = "wave-text";
    waveText.innerHTML = message;

    document.body.appendChild(waveText);

    setTimeout(function () {
        document.body.removeChild(waveText);
    }, 1900);
}

/*
game.enemyIntervalTimer = game.enemySpawnInterval;
if (game.enemiesKilled === 10) {
    waveMessage("Wave 2")
} else if (game.enemiesKilled === 20) {
    waveMessage("Wave 3")
} else if (game.enemiesKilled === 40) {
    waveMessage("Infinite waaaave!")
}

/*
const waveMessageUpdated = () => {
    setTimeout(function () {
        waveMessage("Wave 2")
    }, 29000)
    setTimeout(function () {
        waveMessage("Wave 3")
    }, 59000)
    setTimeout(function () {
        waveMessage("Infinite wave!")
    }, 99000)
}

const waveMessageUpdated2 = () => { 
    if(isPaused == false){
        setTimeout(function () {
            waveMessage("Wave 2")
        }, 29000, () => {
            if(isPaused == true) {
                
            }
        })
        setTimeout(function () {
            waveMessage("Wave 3")
        }, 59000)
        setTimeout(function () {
            waveMessage("Infinite wave!")
        }, 99000)
    }
}

waveMessage("Wave 1")
if(enemiesKilledChecker === 10){
    waveMessage("Wave 2")
}
if(enemiesKilledChecker === 20){
    waveMessage("Wave 3")
}
if(enemiesKilledChecker === 50){
    waveMessage("Infinite waaaaave!")
}
*/