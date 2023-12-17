export const addScore = (difficultyMultiplier, enemiesKilled, playerScore) => {
    const playerScores = JSON.parse(localStorage.getItem('playerScores') || '[]')

    playerScores.push({difficultyMultiplier, enemiesKilled, playerScore})

    localStorage.setItem('playerScores', JSON.stringify(playerScores))
}

export const getHighestScore = () => {
    const playerScores = JSON.parse(localStorage.getItem('playerScores') || '[]')

    playerScores.sort((a,b) => b.playerScore - a.playerScore)
    return playerScores[0]
}