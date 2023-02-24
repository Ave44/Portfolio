import axios from "axios"
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const EditLevel = (props) => {
    const history = useHistory()

    const id = useParams().id
    const level = props.levels[id]

    const [width, setWidth] = useState(8)
    const [height, setHeight] = useState(8)
    const [map, setMap] = useState([])
    const [path, setPath] = useState([])
    const [waves, setWaves] = useState('')

    useEffect(()=>{
        if(level) {
            setWidth(level.width)
            setHeight(level.height)
            setPath(level.path)
            setWaves(level.waves.map(e=>e.map(a=>a.join(' '))).map(e=>e.join(',')).join(' . '))
        }
    },[level])

    useEffect(()=>{
        const generatedMap = []
        for(let i = 0; i < width*height; i++) {
            generatedMap.push(i)
        }
        setMap(generatedMap)
        if(level) {
            if(width === level.width && height === level.height) {
                setPath(level.path)
            }
            else { setPath([])}
        }
        else { setPath([]) }
    },[width, height, level])

    const editLevel = () => {
        const name = document.getElementById('name').value.trim()
        const gold = parseInt(document.getElementById('gold').value)
        const formatedPath = path.join(' ')
        const waves = document.getElementById('waves').value.trim()
        const startingtowers = document.getElementById('startingtowers').value.trim()
        if(name && waves && startingtowers) {
            const level = {name, width, height, gold, path: formatedPath, waves, startingtowers}
            axios.post(`http://localhost:5000/levels/edit/${id}`, level)
            .then(res => {
                history.push('/levels')

                const startingtowers = res.data.startingtowers.split(' ')
                const waves = res.data.waves.split('.').map(e=>e.split(',')).map(e=>e.map(a=>a.split(" ")))
                const path = res.data.path.split(' ').map(e=>parseInt(e))
                props.setLevels({...props.levels, [res.data.id]: {...res.data, startingtowers, waves, path}})
            })
            .catch(err => {
                window.alert("Threre was a problem with editing the level")
                console.log(err)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }

    const deleteLevel = () => {
        axios.delete(`http://localhost:5000/levels/${id}`)
        .then(res => {
            history.push('/levels')
            props.setLevels({...props.levels, [id]: null})
        })
        .catch(err => {
            window.alert("Threre was a problem with deleting the enemy")
            console.log(err)
        })
    }

    const addToPath = (index) => {
        if(path.length === 0) {
            const avaiableIndexes = []
            for(let i = 0; i < width; i++) {avaiableIndexes.push(i)}
            for(let i = width*(height-1); i < width*height; i++) {avaiableIndexes.push(i)}
            for(let i = width; i < width*(height-1); i = i + width) {avaiableIndexes.push(i)}
            for(let i = 2*width-1; i < width*(height-1); i = i + width) {avaiableIndexes.push(i)}

            if(avaiableIndexes.includes(index)) { setPath([index]) }
        }
        else {
            const lastElem = path[path.length-1]
            if(index === lastElem+1 || index === lastElem-1 || index === lastElem+width || index === lastElem-width) {
                setPath([...path, index])
            }
        }
    }

    const removeFromPath = (index) => {
        if(index === path[path.length-1]) {
            const elementIndex = path.indexOf(index)
            const newArray = [...path.slice(0, elementIndex), ...path.slice(elementIndex+1)]
            setPath(newArray)
        }
    }

    const displayMap = () => {
        return map.map(e=>{
            if(path.includes(e)) {
                return <div className="mapField path" onClick={()=>{removeFromPath(e)}} key={e}/>
            }
            return <div className="mapField" onClick={()=>{addToPath(e)}} key={e}/>
        })
    }

    const form = (level) => {
        return <div className="form">
            <div className="header">Edit Level</div>
            <div className="title">Name</div>
            <input id='name' className="input" defaultValue={level.name}/>
            <div className="title">Map width</div>
            <input type="number" min={1} defaultValue={level.width} id='width' className="input" onChange={(e)=>{e.target.value > 0 ? setWidth(parseInt(e.target.value)) : setWidth(1)}}/>
            <div className="title">Map height</div>
            <input type="number" min={1} defaultValue={level.height} id='height' className="input" onChange={(e)=>{e.target.value > 0 ? setHeight(parseInt(e.target.value)) : setHeight(1)}}/>
            <div className="title">Starting gold</div>
            <input type="number" min={1} defaultValue={level.gold} id='gold' className="input"/>
            <div className="title">Path</div>
            <div className="map" style={{width: `${width*29}px`}}>{displayMap()}</div>
            <div className="title">Waves</div>
            <textarea className="textarea" id="waves" defaultValue={waves} placeholder={`label <- enemy label\n,     <- next tick\n,,    <- empty tick no enemies spawned\n.     <- end of wave\nlabels must be separated by blank space\n\nexample:\nlabel label , , , label . label`} />
            <div className="title">Starting towers</div>
            <input id='startingtowers' className="input" defaultValue={level.startingtowers.join(' ')} placeholder="labels (np: t1 t2 t3)"/>
        </div>
    }

    if(level) {
        return <div>
            {form(level)}
            <div className="button" onClick={()=>{editLevel()}}>Save</div>
            <div className="button" onClick={()=>{deleteLevel()}}>Delete</div>
        </div>
    }
    return <div>...</div>
}

export default EditLevel