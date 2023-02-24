import { useHistory, useParams } from "react-router-dom"
import axios from "axios"

const Upgrades = (props) => {
    const history = useHistory()

    const label = useParams().label
    const tower = props.towers[label]

    const deleteUpgrade = (id) => {
        axios.delete(`http://localhost:5000/upgrades/${id}`)
        .then(res => {
            props.setUpgrades({...props.upgrades, [label]: props.upgrades[label].filter(e=>{return e.id === id ? false : true}) })
        })
        .catch(err => {
            window.alert("Threre was a problem with deleting the upgrade")
            console.log(err.response.data)
        })
    }

    const displayUpgrades = () => {
        if(tower.upgrades) {
            return tower.upgrades.map(e=>{return <div key={`${e.label} ${e.name}`} className="upgrade">
                <div className="text">
                    <div>{e.label}</div>
                    <div>{e.name}</div>
                    <div>{e.cost}</div>
                </div>
                <div>
                    <div className="button" onClick={()=>{history.push(`${label}/edit/${e.id}`)}}>Edit</div>
                    <div className="button" onClick={()=>{deleteUpgrade(e.id)}}>Delete</div>
                </div>
            </div>})
        }
        return <div></div>
    }

    if(tower) {
        return <div className="content">
            <div className="header">
                <div className="title">{tower.name}</div>
                <div className="button" onClick={()=>{history.push(`${label}/add`)}}>Add</div>
            </div>
            <div>{displayUpgrades()}</div>
        </div>
    }
    return <div>...</div>
}

export default Upgrades