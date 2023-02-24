import { useHistory, useParams } from "react-router-dom"
import axios from "axios"

const UpgradeEdit = (props) => {
    const history = useHistory()

    const id = parseInt(useParams().id)
    const label = useParams().label
    const upgrade = props.upgrades[label]

    const editUpgrade = () => {
        const label2 = document.getElementById('label').value.trim()
        const name = document.getElementById('name').value.trim()
        const cost = parseInt(document.getElementById('cost').value)
        const upgrade = {label1: label, label2, name, cost}
        if(label2 && name && cost >= 0) {
            axios.post(`http://localhost:5000/upgrades/edit/${id}`, upgrade)
            .then(res => {
                props.setUpgrades({...props.upgrades, [label]: [...props.upgrades[label].filter(e=>{return e.id !== id}), {label: upgrade.label2, cost: upgrade.cost, name: upgrade.name, id: res.data.id}] })
                history.push(`/towers/upgrades/${label}`)
            })
            .catch(err => {
                window.alert("Threre was a problem with editing the upgrade")
                console.log(err.response.data)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }

    const form = (upgrade) => {
        const thisUpgrade = upgrade.filter(e=>{return e.id === id})[0]

        return <div className="form">
            <div className="header">Edit an upgrade</div>
            <div className="title">Label</div>
            <input id='label' className="input" defaultValue={thisUpgrade.label}/>
            <div className="title">Upgrade Name</div>
            <input id='name' className="input" defaultValue={thisUpgrade.name}/>
            <div className="title">Cost</div>
            <input type="number" min={0} defaultValue={thisUpgrade.cost} id='cost' className="input"/>
        </div>
    }

    if(upgrade) {
        return <div>
            {form(upgrade)}
            <div className="button" onClick={()=>{editUpgrade()}}>Save</div>
        </div>
    }

    return <div>...</div>
}

export default UpgradeEdit