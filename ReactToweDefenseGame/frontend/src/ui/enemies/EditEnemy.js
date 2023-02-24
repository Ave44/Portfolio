import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

const EditEnemy = (props) => {
    const label = useParams().label
    const enemy = props.allEnemies[label]

    const history = useHistory()

    const [speed, setSpeed] = useState(1)
    const [armor, setArmor] = useState(0)
    const [magicResistance, setMagicResistance] = useState(0)

    useEffect(()=>{
        if(enemy) {
            setSpeed(Math.floor(1/enemy.speed))
            setArmor(Math.round(enemy.armor*100))
            setMagicResistance(Math.round(enemy.magicresistance*100))
        }
    },[enemy])

    const editEnemy = () => {
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
            const editedEnemy = {name, label, img, hp, maxhp, speed, loss, armor, magicresistance, gold, id: enemy.id}

            axios.post(`http://localhost:5000/enemies/edit/${editedEnemy.id}`, editedEnemy)
            .then(res => {
                history.push('/enemies')
                props.setAllEnemies({...props.allEnemies, [label]: editedEnemy})
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

    const deleteEnemy = () => {
        axios.delete(`http://localhost:5000/enemies/${label}`)
        .then(res => {
            history.push('/enemies')
            props.setAllEnemies({...props.allEnemies, [enemy.label]: null})
        })
        .catch(err => {
            window.alert("Threre was a problem with deleting the enemy")
            console.log(err)
        })
    }

    const form = (enemy) => {
        return <div className="form">
            <div className="header">Edit an enemy</div>
            <div className="title">Name</div>
            <input id='name' className="input" defaultValue={enemy.name}/>
            <div className="title">Label</div>
            <input id='label' className="input" defaultValue={enemy.label}/>
            <div className="title">Image</div>
            <input id='img' className="input" defaultValue={enemy.img}/>
            <div className="title">Health</div>
            <input type="number" min={0} defaultValue={enemy.hp} id='hp' className="input"/>
            <div className="title">Max health</div>
            <input type="number" min={0} defaultValue={enemy.maxhp} id='maxHp' className="input"/>
            <div className="title">Turns to move</div>
            <div className="slider">
                <div>{speed}</div>
                <input type='range' id="speed" min="1" max="10" step="1" defaultValue={Math.floor(1/enemy.speed)} onChange={(e)=>{setSpeed(e.target.value)}}/>
            </div>
            <div className="title">Loss</div>
            <input type="number" min={0} defaultValue={enemy.loss} id='loss' className="input"/>
            <div className="title">Armor</div>
            <div className="slider">
                <div className="margin">{armor}%</div>
                <input type='range' id="armor" min="0" max="100" step="1" defaultValue={enemy.armor*100} onChange={(e)=>{setArmor(e.target.value)}}/>
            </div>
            <div className="title">Magic Resistance</div>
            <div className="slider">
                <div className="margin">{magicResistance}%</div>
                <input type='range' id="magicResistance" min="0" max="100" step="1" defaultValue={enemy.magicresistance*100} onChange={(e)=>{setMagicResistance(e.target.value)}}/>
            </div>
            <div className="title">Gold</div>
            <input type="number" min={0} defaultValue={enemy.gold} id='gold' className="input"/>
        </div>
    }

    if(enemy) {
        return <div>
            <div>{form(enemy)}</div>
            <div className="button" onClick={()=>{editEnemy()}}>Save</div>
            <div className="button" onClick={()=>{deleteEnemy()}}>Delete</div>
        </div>
    }
    return <div>...</div>
}

export default EditEnemy