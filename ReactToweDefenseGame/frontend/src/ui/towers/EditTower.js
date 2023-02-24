import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

const EditTower = (props) => {
    const label = useParams().label
    const tower = props.allTowers[label]
    const damageTypes = ['physical', 'magical', 'true']

    const history = useHistory()

    const [range, setRange] = useState(0)
    const [speed, setSpeed] = useState(1)

    useEffect(()=>{
        if(tower) {
            setRange(tower.range)
            setSpeed(tower.speed)
        }
    },[tower])

    const editTower = () => {
        const label = document.getElementById('label').value.trim()
        const name = document.getElementById('name').value.trim()
        const img = document.getElementById('img').value.trim()
        const type = document.querySelector('input[name="type"]:checked').value;
        const mindamage = parseInt(document.getElementById('mindamage').value)
        const maxdamage = parseInt(document.getElementById('maxdamage').value)
        const cost = parseInt(document.getElementById('cost').value)
        if(label && img && name && mindamage >= 0 && maxdamage >= 0 && mindamage <= maxdamage && cost >= 0) {
            const editedTower = {label, name, img, type, mindamage, maxdamage, speed, range, cost, id: tower.id}

            axios.post(`http://localhost:5000/towers/edit/${editedTower.id}`, editedTower)
            .then(res => {
                history.push('/towers')
                if(tower.label === editedTower.label) {
                    props.setAllTowers({...props.allTowers, [editedTower.label]: editedTower})
                }
                else {
                    props.setAllTowers({...props.allTowers, [editedTower.label]: editedTower, [tower.label]: null})
                }
            })
            .catch(err => {
                window.alert("Threre was a problem with editing the tower")
                console.log(err.response.data)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }

    const deleteTower = () => {
        axios.delete(`http://localhost:5000/towers/${tower.label}`)
        .then(res => {
            history.push('/towers')
            props.setAllTowers({...props.allTowers, [tower.label]: null})
        })
        .catch(err => {
            window.alert("Threre was a problem with deleting the tower")
            console.log(err.response.data)
        })
    }

    const displayRange = () => {
        const img = require(`../../game/images/ranges/range${range}.png`)
        return <img src={img} alt='' className="range"/>
    }

    const form = (tower) => {
        return <div className="form">
            <div className="header">Edit tower</div>
            <div className="title">Label</div>
            <input id='label' className="input" defaultValue={tower.label}/>
            <div className="title">Name</div>
            <input id='name' className="input" defaultValue={tower.name}/>
            <div className="title">Image</div>
            <input id='img' className="input" defaultValue={tower.img}/>
            <div className="title">Cost</div>
            <input type="number" min={0} defaultValue={tower.cost} id='cost' className="input"/>
            <div className="title">Damage</div>
            <div className="dmgFlex">
                <div>from</div>
                <input type="number" min={0} defaultValue={tower.mindamage} id='mindamage'/>
                <div>to</div>
                <input type="number" min={0} defaultValue={tower.maxdamage} id='maxdamage'/>
            </div>
            <div className="title">Damage type</div>
            <div className="radioFlex">
                {damageTypes.map(e=>{
                    if(e === tower.type) {
                        return <div key={e}>
                        <input type='radio' name='type' id={e} value={e} defaultChecked/>
                        <label htmlFor={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</label>
                    </div>
                    }
                    return <div key={e}>
                        <input type='radio' name='type' id={e} value={e}/>
                        <label htmlFor={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</label>
                    </div>
                })}
            </div>
            <div className="title">Range</div>
            <div className="slider">
                <div className="lower">{range}</div>
                <input type='range' id="range" min="0" max="7" step="1" defaultValue={tower.range} onChange={(e)=>{setRange(e.target.value)}}/>
                <div className="rangeWraper">{displayRange()}</div>
            </div>
            
            <div className="title">Turns to attack</div>
            <div className="slider">
                <div>{speed}</div>
                <input type='range' id="speed" min="1" max="10" step="1" defaultValue={tower.speed} onChange={(e)=>{setSpeed(e.target.value)}}/>
            </div>
        </div>
    }

    if(tower) {
        return <div>
            <div>{form(tower)}</div>
            <div className="button" onClick={()=>{editTower()}}>Save</div>
            <div className="button" onClick={()=>{history.push(`/towers/upgrades/${tower.label}`)}}>Upgrades</div>
            <div className="button" onClick={()=>{deleteTower()}}>Delete</div>
        </div>
    }
    return <div>...</div>
}

export default EditTower