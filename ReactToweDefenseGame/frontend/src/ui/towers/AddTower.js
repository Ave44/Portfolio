import axios from "axios"
import { useState } from "react";
import { useHistory } from "react-router-dom";

const AddTower = (props) => {
    const history = useHistory()

    const [range, setRange] = useState(0)
    const [speed, setSpeed] = useState(1)

    const createTower = () => {
        const label = document.getElementById('label').value.trim()
        const name = document.getElementById('name').value.trim()
        const img = document.getElementById('img').value.trim()
        const type = document.querySelector('input[name="type"]:checked').value;
        const mindamage = parseInt(document.getElementById('mindamage').value)
        const maxdamage = parseInt(document.getElementById('maxdamage').value)
        const cost = parseInt(document.getElementById('cost').value)
        if(label && img && name && mindamage >= 0 && maxdamage >= 0 && mindamage <= maxdamage && cost >= 0) {
            const tower = {label, name, img, type, mindamage, maxdamage, speed, range, cost}

            axios.post('http://localhost:5000/towers', tower)
            .then(res => {
                history.push('/towers')
                props.setAllTowers({...props.allTowers, [tower.label]: {...tower, id: res.data.id}})
            })
            .catch(err => {
                window.alert("Threre was a problem with adding the tower")
                console.log(err)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }

    const displayRange = () => {
        const img = require(`../../game/images/ranges/range${range}.png`)
        return <img src={img} alt='' className="range"/>
    }

    const form = () => {
        return <div className="form">
            <div className="header">Add a tower</div>
            <div className="title">Label</div>
            <input id='label' className="input"/>
            <div className="title">Name</div>
            <input id='name' className="input"/>
            <div className="title">Image</div>
            <input id='img' className="input"/>
            <div className="title">Cost</div>
            <input type="number" min={0} defaultValue={100} id='cost' className="input"/>
            <div className="title">Damage</div>
            <div className="dmgFlex">
                <div>from</div>
                <input type="number" min={0} defaultValue={0} id='mindamage'/>
                <div>to</div>
                <input type="number" min={0} defaultValue={1} id='maxdamage'/>
            </div>
            <div className="title">Damage type</div>
            <div className="radioFlex">
                <div>
                    <input type='radio' name='type' id='physical' value='physical' defaultChecked/>
                    <label htmlFor="physical">Physical</label>
                </div>
                <div>
                    <input type='radio' name='type' id='magical' value='magical'/>
                    <label htmlFor="magical">Magical</label>
                </div>
                <div>
                    <input type='radio' name='type' id='true' value='true'/>
                    <label htmlFor="true">True</label>
                </div>
            </div>
            <div className="title">Range</div>
            <div className="slider">
                <div className="lower">{range}</div>
                <input type='range' id="range" min="0" max="7" step="1" defaultValue={0} onChange={(e)=>{setRange(e.target.value)}}/>
                <div className="rangeWraper">{displayRange()}</div>
            </div>
            
            <div className="title">Turns to attack</div>
            <div className="slider">
                <div>{speed}</div>
                <input type='range' id="speed" min="1" max="10" step="1" defaultValue={1} onChange={(e)=>{setSpeed(e.target.value)}}/>
            </div>
        </div>
    }

    return <div>
        {form()}
        <div className="button" onClick={()=>{createTower()}}>Add</div>
    </div>
}

export default AddTower