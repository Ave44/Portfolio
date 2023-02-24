import axios from "axios"
import { useState } from "react";
import { useHistory } from "react-router-dom";

const AddEnemy = (props) => {
    const history = useHistory()

    const [speed, setSpeed] = useState(1)
    const [armor, setArmor] = useState(0)
    const [magicResistance, setMagicResistance] = useState(0)

    const createEnemy = () => {
        const name = document.getElementById('name').value.trim()
        const label = document.getElementById('label').value.trim()
        const img = document.getElementById('img').value.trim()
        const hp = parseInt(document.getElementById('hp').value)
        const maxhp = parseInt(document.getElementById('maxHp').value)
        const speed = 1/parseInt(document.getElementById('speed').value)
        const loss = parseInt(document.getElementById('loss').value)
        const armor = parseInt(document.getElementById('armor').value)/100
        const magicresistance = parseInt(document.getElementById('magicResistance').value)/100
        const gold = parseInt(document.getElementById('gold').value)
        if(name && label && img && hp >= 0 && maxhp >= 0 && maxhp >= hp && loss >= 0 && gold >= 0) {
            const enemy = {name, label, img, hp, maxhp, speed, loss, armor, magicresistance, gold}
            
            axios.post('http://localhost:5000/enemies', enemy)
            .then(res => {
                history.push('/enemies')
                props.setAllEnemies({...props.allEnemies, [label]: {...enemy, id: res.data.id}})
            })
            .catch(err => {
                window.alert("Threre was a problem with adding the enemy")
                console.log(err.response.data)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }


    const form = () => {
        return <div className="form">
            <div className="header">Add an enemy</div>
            <div className="title">Name</div>
            <input id='name' className="input"/>
            <div className="title">Label</div>
            <input id='label' className="input"/>
            <div className="title">Image</div>
            <input id='img' className="input"/>
            <div className="title">Health</div>
            <input type="number" min={0} defaultValue={20} id='hp' className="input"/>
            <div className="title">Max health</div>
            <input type="number" min={0} defaultValue={20} id='maxHp' className="input"/>
            <div className="title">Turns to move</div>
            <div className="slider">
                <div>{speed}</div>
                <input type='range' id="speed" min="1" max="10" step="1" defaultValue={1} onChange={(e)=>{setSpeed(e.target.value)}}/>
            </div>
            <div className="title">Loss</div>
            <input type="number" min={0} defaultValue={1} id='loss' className="input"/>
            <div className="title">Armor</div>
            <div className="slider">
                <div className="margin">{armor}%</div>
                <input type='range' id="armor" min="0" max="100" step="1" defaultValue={0} onChange={(e)=>{setArmor(e.target.value)}}/>
            </div>
            <div className="title">Magic Resistance</div>
            <div className="slider">
                <div className="margin">{magicResistance}%</div>
                <input type='range' id="magicResistance" min="0" max="100" step="1" defaultValue={0} onChange={(e)=>{setMagicResistance(e.target.value)}}/>
            </div>
            <div className="title">Gold</div>
            <input type="number" min={0} defaultValue={5} id='gold' className="input"/>
        </div>
    }

    return <div>
        {form()}
        <div className="button" onClick={()=>{createEnemy()}}>Add</div>
    </div>
}

export default AddEnemy