import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Game from "./Game"

const GameDataLoader = (props) => {

    const id = useParams().id
    const [towers, setTowers] = useState(props.towers)
    const [enemies, setEnemies] = useState(props.enemies)
    const [level, setLevel] = useState({})
    const [levelData, setLevelData] = useState({})
    const [map, setMap] = useState([])

    useEffect(()=> {
        if(Object.keys(props.towers).length !== 0 && Object.keys(props.enemies).length !== 0 && Object.keys(props.levels).length !== 0) {
            setTowers(props.towers)
            setEnemies(props.enemies)
            setLevel(props.levels[id])
        }
    },[props, id])

    useEffect(()=> {
        if(Object.keys(level).length !== 0) {
                const generatedMap = []
                for(let i = 0; i < level.width * level.height; i++) {
                    generatedMap.push(i)
                }

                const startingtowers = level.startingtowers.map(e=>towers[e])

                const animationsAndBackgrounds = getAnimationsAndBackgrounds(level.width, level.path)

                const waves = [[], ...level.waves.map(e=>e.map(a=>a.map(b=>{return b !== '' ? enemies[b] : []})))]

                setMap(generatedMap)
                setLevelData({...level, waves, startingtowers, ...animationsAndBackgrounds})
            }
    }, [level, towers, enemies])  

    const getAnimationsAndBackgrounds = (width, path) => {
        const calculateDirection = (a,b) => {
            if(a + 1 === b) {return 'Right'}
            if(a - 1 === b) {return 'Left'}
            if(a + width === b) {return 'Down'}
            if(a - width === b) {return 'Up'}
            return 'end'
        }

        const directionsTable = []
        for(let i = 0; i < path.length; i++) {
            if(calculateDirection(path[i],path[i+1]) !== 'end') { directionsTable.push(calculateDirection(path[i],path[i+1])) }
            else { directionsTable.push(directionsTable.slice(-1)[0]) }
        }

        const animationTable = []
        for(let i = 0; i < directionsTable.length; i++) {
            if(directionsTable[i-1]) {
                if(directionsTable[i] === directionsTable[i-1]) { animationTable.push('move' + directionsTable[i]) }
                else { animationTable.push('move' + directionsTable[i-1] + directionsTable[i]) }
            }
            else { animationTable.push('move' + directionsTable[i]) }
        }  
        
        const getDirection = (a) => {
            if(a === 'moveDown' || a === 'moveUp') { return "Horizontal" }
            if(a === 'moveRight' || a === 'moveLeft') { return "Vertical" }
            if(a === 'moveDownRight' || a === 'moveLeftUp') { return "Turn0" }
            if(a === 'moveUpRight' || a === 'moveLeftDown') { return "Turn90" }
            if(a === 'moveRightDown' || a === 'moveUpLeft') { return "Turn180" }
            if(a === 'moveDownLeft' || a === 'moveRightUp') { return "Turn270" }
            return null
        }

        const pathBackgrounds = animationTable.reduce((pre,cur, index)=>{ return {...pre, [path[index]]: getDirection(cur)} }, {})
        return {animationTable, pathBackgrounds}
    }

    const getRange = (index, range, width) => {
        const result = [index]
        if(range > 0) {
            if(index%width-1 >= 0) { result.push(index-1) }
            if(index%width+1 < width) { result.push(index+1) }
            result.push(index-width, index+width)
        }
        if(range > 1) {
            if(index%width-1 >= 0) { result.push(index-width-1, index+width-1) }
            if(index%width+1 < width) { result.push(index-width+1, index+width+1) }
            
        }
        if(range > 2) {
            if(index%width-2 >= 0) { result.push(index-2) }
            if(index%width+2 < width) { result.push(index+2) }
            result.push(index-(2*width), index+(2*width))
        }
        if(range > 3) {
            if(index%width-1 >= 0) { result.push(index-(2*width)-1, index+(2*width)-1) }
            if(index%width+1 < width) { result.push(index-(2*width)+1, index+(2*width)+1) }
            if(index%width-2 >= 0) { result.push(index-width-2, index+width-2) }
            if(index%width+2 < width) { result.push(index-width+2, index+width+2) }
        }
        if(range > 4) {
            if(index%width-2 >= 0) { result.push(index-(2*width)-2, index+(2*width)-2) }
            if(index%width+2 < width) { result.push(index-(2*width)+2, index+(2*width)+2) }
        }
        if(range > 5) {
            if(index%width-1 >= 0) { result.push(index-(3*width)-1, index+(3*width)-1) }
            if(index%width+1 < width) { result.push(index-(3*width)+1, index+(3*width)+1) }
            if(index%width-3 >= 0) { result.push(index-width-3, index-3, index+width-3) }
            if(index%width+3 < width) { result.push(index-width+3, index+3, index+width+3) }
            result.push(index-(3*width), index+(3*width)) 
        }
        if(range > 6) {
            if(index%width-2 >= 0) { result.push(index-(3*width)-2, index+(3*width)-2) }
            if(index%width+2 < width) { result.push(index-(3*width)+2, index+(3*width)+2) }
            if(index%width-3 >= 0) { result.push(index-(3*width)-3, index-(2*width)-3, index+(2*width)-3, index+(3*width)-3) }
            if(index%width+3 < width) { result.push(index-(3*width)+3, index-(2*width)+3, index+(2*width)+3, index+(3*width)+3) }
        }
        return result.filter(e=>{ return e >= 0 ? true : false})
    }

    if(Object.keys(levelData).length !== 0 && levelData.pathBackgrounds) {
        return <div className='game' style={{'--size': `${800/level.width}px`}}><Game level={levelData} towers={towers} getRange={getRange} map={map}/></div>
    }
    return <div>...</div>
}

export default GameDataLoader