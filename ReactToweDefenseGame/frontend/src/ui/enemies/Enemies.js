import coin from '../../game/images/coin.png'
import heart from '../../game/images/heart.png'
import { useHistory } from "react-router-dom";
import { useState } from 'react';

const Enemies = (props) => {
    const history = useHistory()
    const [search, setSearch] = useState('')

    const enemies = []
    for (const [key, value] of Object.entries(props.enemies)) {
        if(value) {
            enemies.push({label: key, ...value})
        }
    }

    return <div className='content'>
        <div className='header'>
            <div className='title'>Enemies</div>
            <input placeholder='search...' onChange={(e)=>{setSearch(e.target.value)}}/>
            <div onClick={()=>{history.push('enemies/add')}} className='button'>add</div>
        </div>
        <div className='list'>
            {enemies.filter(e=>{return e.name.toLowerCase().includes(search.toLowerCase())}).map(e=>{
                let img = null
                try {
                    img = require(`../../game/images/${e.img}.png`)
                } catch {
                    img = require(`../../game/images/unknown.png`)
                }
                
                return <div key={e.label} className='item' onClick={()=>{history.push(`enemies/edit/${e.label}`)}}>
                    <img src={img} alt='' className='image path'/>
                    <div className='title'>{e.name}</div>
                    <div>hp</div>
                    <div className='withImage'>
                        <div>{e.hp}</div>
                        <img src={heart} alt='$' className='small-image'/>
                    </div>
                    <div>max hp</div>
                    <div className='withImage'>
                        <div>{e.maxhp}</div>
                        <img src={heart} alt='$' className='small-image'/>
                    </div>
                    <div>armor</div>
                    <div>{Math.round(e.armor*100)}%</div>
                    <div>magic resistance</div>
                    <div>{Math.round(e.magicresistance*100)}%</div>
                    <div>worth</div>
                    <div className='withImage'>
                        <div>{e.gold}</div>
                        <img src={coin} alt='$' className='small-image'/>
                    </div>
                    <div>loss</div>
                    <div>{e.loss}</div>
                    <div>speed</div>
                    <div>{Math.round(e.speed * 100)/100}</div>
            </div>})}
        </div>
    </div>
}

export default Enemies