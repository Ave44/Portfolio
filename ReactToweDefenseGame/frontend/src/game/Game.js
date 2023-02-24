import { useState, useEffect } from "react"
import { v4 as uuid } from 'uuid'
import Statistics from './Statistics'
import Map from "./Map"
import Cookies from "js-cookie"

const Game = (props) => {
    const tickSpeed = 500
    const map = props.map
    const width = props.level.width
    const path = props.level.path
    const waves = props.level.waves
    const startingTowers = props.level.startingtowers
    const towers = props.towers
    const livesLostThisRound = []
    const newTowers = []
    const towersToSell = []
    const goldDifrence = []
    const [gameData, setGameData] = useState({hp: 20, gold: 0, currentWave: 0, waveIndex: 0, enemies: {}, towers: {}})
    const [gameStatus, setGameStatus] = useState({lost: false, victory: false, waveEnd: true, lastWave: false, sentCokie: true})

    useEffect(()=>{
        setGameData({hp: 20, gold: props.level.gold, currentWave: 0, waveIndex: 0, enemies: {}, towers: {}})
    },[props.level])

    const loseLives = () => {
        if(livesLostThisRound.length > 0) {
            const lives = gameData.hp - livesLostThisRound.reduce((pre,cur) => {return pre + cur}, 0)
            if(lives <= 0) {
                setGameStatus({...gameStatus, lost: true})
            }
            return lives
        }
        return gameData.hp
    }   

    const moveEnemy = (enemy) => {
        if(enemy.position < (path.length) ) {
            return {...enemy, position: enemy.position + enemy.speed, positionIndex: path[Math.floor(enemy.position + enemy.speed)], animationProgres: (enemy.animationProgres + enemy.speed) % 1}
        }
        livesLostThisRound.push(enemy.loss)
    }

    const randomOffset = () => {
        return Math.random().toFixed(2) * 800/width*0.5 - 800/width*0.25
    }

    const handleTickEnemies = () => {
        const enemiesAfterMove = {}
        for (const [key, value] of Object.entries(gameData.enemies)) {
            if(value.hp > 0) {
                const enemyAfterMove = moveEnemy(value)
                if(enemyAfterMove) { enemiesAfterMove[key] = enemyAfterMove }
            }
            else {
                gameData.gold = gameData.gold + value.gold
            }
        }

        const newEnemies = waves[gameData.currentWave][gameData.waveIndex]
        if(!gameStatus.waveEnd) {
            const spawnedEnemies = {}
            for(let i = 0; i < newEnemies.length; i++) {
                if(newEnemies[i].label ? true : false) {
                    spawnedEnemies[uuid().substring(0,4)] = {...newEnemies[i], position: 0, positionIndex: path[0], animationProgres: 0, offsetX: randomOffset(), offsetY: randomOffset()}
                }
            }
            return {...enemiesAfterMove, ...spawnedEnemies}
        }
        else {
            return enemiesAfterMove
        }
    }

    const nextWave = () => {
        gameStatus.waveEnd = false
        gameData.currentWave = gameData.currentWave + 1
        gameData.waveIndex = 0
    }

    const handleTickWave = () => {
        if(waves[gameData.currentWave][gameData.waveIndex + 1]) {
            return gameData.waveIndex + 1
        }
        gameStatus.waveEnd = true

        if(props.level.waves.length-1 === gameData.currentWave && gameData.waveIndex === props.level.waves[props.level.waves.length-1].length-1) {
            gameStatus.lastWave = true
        }
        if(gameData.hp > 0 && Object.keys(gameData.enemies).length === 0 && props.level.waves.length - 1 === gameData.currentWave) {
            gameStatus.victory = true
        }
        return gameData.waveIndex
    }

    const createTower = (index, label) => {
        const tower = towers[label]
        const inRange = props.getRange(index, tower.range, width).filter(e=>path.includes(e))
        return {[index]: {...tower, inRange, initiative: 0} }
    }

    const handleTickTowers = () => {
        if(towersToSell.length !== 0) {
            for(let i = 0; i < towersToSell.length; i++) {
                delete gameData.towers[towersToSell[i]]
            }  
        }
        if(newTowers.length !== 0) {
            const newKeys = newTowers.reduce((pre,cur)=>{return {...pre, ...createTower(cur.index, cur.label)}}, {})
            return {...gameData.towers, ...newKeys}
        }
        for (const [key, value] of Object.entries(gameData.towers)) {
            if(value.initiative < value.speed) {
                gameData.towers[key] = {...value, initiative: value.initiative + 1}
            }
        }
        return gameData.towers
    }

    const dealDamage = (enemyId, tower) =>{
        const enemy = gameData.enemies[enemyId]
        const damage = Math.floor(Math.random() * (tower.maxdamage - tower.mindamage + 1) + tower.mindamage)
        if(tower.type === 'physical') {
            gameData.enemies[enemyId] = {...gameData.enemies[enemyId], hp: enemy.hp - Math.floor(damage*(1-enemy.armor))}
        }
        else if(tower.type === 'magical') {
            gameData.enemies[enemyId] = {...gameData.enemies[enemyId], hp: enemy.hp - Math.floor(damage*(1-enemy.magicresistance))}
        }
        else {
            gameData.enemies[enemyId] = {...gameData.enemies[enemyId], hp: enemy.hp - damage}
        }
    }

    const getEnemiesInRange = (tilesInRange) => {
        const enemiesOnPath = []
        for (const [key, value] of Object.entries(gameData.enemies)) {
            enemiesOnPath.push({id: key, hp: value.hp, position: value.position, index: value.positionIndex})
        }
        const sorted = enemiesOnPath.sort((a,b)=>{return a.position - b.position})
        const enemiesInRange = sorted.filter(e=>tilesInRange.includes(e.index))
        return enemiesInRange.filter(e=>{return e.hp > 0})
    }

    const handleAttacks = () => {
        for (const [key, value] of Object.entries(gameData.towers)) {
            const enemiesInRange = getEnemiesInRange(value.inRange)
            if(value.initiative === value.speed) {
                if(enemiesInRange.length > 0) {
                    const attackedEnemy = enemiesInRange[enemiesInRange.length - 1]
                    dealDamage(attackedEnemy.id,gameData.towers[key])
                    gameData.towers[key].initiative = 0
                }
            }
        }
    }

    const handleGold = () => {
        if(goldDifrence.length > 0) {
            const difrence = goldDifrence.reduce((pre,cur)=>{return pre + cur}, 0)
            return gameData.gold - difrence
        }
        return gameData.gold
    }

    const tick = () => {
        // console.log('----------tick----------')
        handleAttacks()
        setGameData({...gameData, towers: handleTickTowers(), enemies: handleTickEnemies(), waveIndex: handleTickWave(), hp: loseLives(), gold: handleGold()})
        // ^ Kolejność jest ważna!
    }

    const checkIfEnd = () => {
        if(gameStatus.victory === true || gameStatus.lost === true) {
            return false
        }
        return true
    }

    useEffect(()=>{
        if(checkIfEnd()) {
            const timer = setInterval(() => {
                tick()
            }, tickSpeed)
            return () => clearInterval(timer)
        }
    })

    if(gameStatus.lost) { return <div className="endScreen">Failure!</div> }
    if(gameStatus.victory) {
        if(gameStatus.sentCokie) {
            gameStatus.sentCokie = false
            const cookie = Cookies.get('victories')
            const today = new Date();
            const tomorrow = new Date(new Date(today.getTime() + (24 * 60 * 60 * 1000)).setHours(0,0,0,0))        
            if(cookie) { Cookies.set('victories', parseInt(cookie) + 1, { expires: tomorrow }) }
            else { Cookies.set('victories', 1, { expires: tomorrow })}
        }
        return <div className="endScreen">Victory!</div>
    }

    return (<div>
        <Statistics hp={gameData.hp} gold={gameData.gold} wave={gameData.currentWave} next={gameStatus.waveEnd} nextWave={nextWave} lastWave={gameStatus.lastWave}/>
        <Map map={map} width={width} enemies={gameData.enemies} path={path} gold={gameData.gold} goldDifrence={goldDifrence}
        pathBackgrounds={props.level.pathBackgrounds} animationTable={props.level.animationTable} tickSpeed={tickSpeed}
        newTowers={newTowers} towersToSell={towersToSell} towers={gameData.towers} startingTowers={startingTowers}/>
    </div>)
}

export default Game