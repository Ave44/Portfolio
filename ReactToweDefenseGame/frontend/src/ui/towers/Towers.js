import coin from '../../game/images/coin.png'
import { useHistory } from "react-router-dom";
import { useState } from 'react';

const Towers = (props) => {
    const history = useHistory()
    const [search, setSearch] = useState('')

    const towers = []
    for (const [key, value] of Object.entries(props.towers)) {
        if(value) {
            towers.push({label: key, ...value})
        }
    }

    return <div className='content'>
        <div className='header'>
            <div className='title'>Towers</div>
            <input placeholder='search...' onChange={(e)=>{setSearch(e.target.value)}}/>
            <div onClick={()=>{history.push('towers/add')}} className='button'>add</div>
        </div>
        <div className='list'>
            {towers.filter(e=>{return e.name.toLowerCase().includes(search.toLowerCase())}).map(e=>{
                let img = null
                try {
                    img = require(`../../game/images/${e.img}.png`)
                } catch {
                    img = require(`../../game/images/unknown.png`)
                }
                
                return <div key={e.label} className='item' onClick={()=>{history.push(`towers/edit/${e.label}`)}}>
                    <img src={img} alt='' className='image'/>
                    <div className='title'>{e.name}</div>
                    <div>cost</div>
                    <div className='withImage'>
                        <div>{e.cost}</div>
                        <img src={coin} alt='$' className='small-image'/>
                    </div>
                    <div>damage</div>
                    <div>{e.mindamage}-{e.maxdamage}</div>
                    <div>{e.type}</div>
                    <div>range</div>
                    <div>{e.range}</div>
                    <div>turns to attack</div>
                    <div>{e.speed}</div>
                </div>})}
        </div>
    </div>
}

export default Towers