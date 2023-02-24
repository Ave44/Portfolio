import { useHistory, useParams } from "react-router-dom"
import axios from "axios"

const UpgradesAdd = (props) => {
    const history = useHistory()

    const label = useParams().label

    const addUpgrade = () => {
        const label2 = document.getElementById('label').value.trim()
        const name = document.getElementById('name').value.trim()
        const cost = parseInt(document.getElementById('cost').value)
        const upgrade = {label1: label, label2, name, cost}
        if(label2 && name && cost >= 0) {
            axios.post(`http://localhost:5000/upgrades`, upgrade)
            .then(res => {
                if(props.upgrades[label]) {
                    props.setUpgrades({...props.upgrades, [label]: [...props.upgrades[label], {label: upgrade.label2, cost: upgrade.cost, name: upgrade.name, id: res.data.id}] })
                }
                else {
                    props.setUpgrades({...props.upgrades, [label]: [ {label: upgrade.label2, cost: upgrade.cost, name: upgrade.name, id: res.data.id} ] })
                }
                history.push(`/towers/upgrades/${label}`)
            })
            .catch(err => {
                window.alert("Threre was a problem with adding the upgrade")
                console.log(err)
            })
        }
        else {
            alert('All fields must be proprely filled!')
        }
    }

    const form = () => {
        return <div className="form">
            <div className="header">Add an upgrade</div>
            <div className="title">Label</div>
            <input id='label' className="input"/>
            <div className="title">Upgrade Name</div>
            <input id='name' className="input"/>
            <div className="title">Cost</div>
            <input type="number" min={0} defaultValue={100} id='cost' className="input"/>
        </div>
    }

    return <div>
        {form()}
        <div className="button" onClick={()=>{addUpgrade()}}>Add</div>
    </div>
}

export default UpgradesAdd