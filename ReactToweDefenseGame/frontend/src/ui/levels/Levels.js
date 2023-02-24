import { useHistory } from "react-router-dom";
import { useState } from 'react';

const Levels = (props) => {
    const history = useHistory()
    const [search, setSearch] = useState('')

    const levels = []
    for (const [key, value] of Object.entries(props.levels)) {
        if(value) {
            levels.push({label: key, ...value})
        }
    }

    return <div className='content'>
        <div className='header'>
            <div className='title'>Levels</div>
            <input placeholder='search...' onChange={(e)=>{setSearch(e.target.value)}}/>
            <div onClick={()=>{history.push('levels/add')}} className='button'>add</div>
        </div>
        <div className='list'>
            {levels.filter(e=>{return e.name.toLowerCase().includes(search.toLowerCase())}).map(e=>{
                return <div key={e.label} className='item' onClick={()=>{history.push(`levels/edit/${e.label}`)}}>
                    <div className='title margin'>{e.name}</div>
                    <div>{e.width}x{e.height}</div>
                    <div>waves</div>
                    <div>{e.waves.length}</div>
                    <div>Starting</div><div>gold</div>
                    <div>{e.gold}</div>
                    <div>Starting towers</div>
                    <div>{e.startingtowers.length}</div>
                    <div className="button" onClick={(event)=>{event.stopPropagation();history.push(`/level/${e.id}`)}}>Play</div>
                </div>})}
        </div>
    </div>
}

export default Levels