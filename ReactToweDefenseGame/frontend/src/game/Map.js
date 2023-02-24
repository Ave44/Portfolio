import { v4 as uuidv4 } from 'uuid';
import Enemy from './Enemy';
import Tower from './Tower';
import coin from './images/coin.png';

const Map = (props) => {
    const width = props.width
    const size = 800/width
    const map = props.map
    const towers = props.startingTowers

    const addTower = (index, label, cost) => {
        const difrence = props.goldDifrence.reduce((pre,cur)=>{return pre + cur}, 0)
        const curGold = props.gold - difrence
        if(curGold >= cost) {
            props.newTowers.push({index, label})
            props.goldDifrence.push(cost)
        }
    }

    const showTowers = (index) => {
        return <div className='options' style={{minHeight: `${size}px`, width: `${size * 3}px`, top: `${-size/2}px`, left: `${-size}px`}}>
            {towers.map(e=>{
            if(props.gold >= e.cost) {
                return <div className='option' key={e.label} onClick={()=>{addTower(index, e.label, e.cost)}}>
                    <div>{e.name}</div>
                    <div className='cost'>{e.cost}</div>
                    <img src={coin} alt='$' className='coin'/>
                </div>
            }
            return <div className='option gray' key={e.label} onClick={()=>{addTower(index, e.label, e.cost)}}>
                <div>{e.name}</div>
                <div className='cost'>{e.cost}</div>
                <img src={coin} alt='$' className='coin'/>
            </div>
            })}
        </div>
    }

    const tile = (index) => {
        
        if(props.path.includes(index)) {
            const enemiesOnTile = []
            for (const [key, value] of Object.entries(props.enemies)) {
                if(value.positionIndex === index) { enemiesOnTile.push(props.enemies[key]) }
            }
            if(enemiesOnTile.length > 0) {
                return <div className={`${props.pathBackgrounds[index]} path`} style={{height: `${size}px`, width: `${size}px`}} key={index}>
                {enemiesOnTile.map(e=>
                <div key={uuidv4().substring(0,8)}>
                    <Enemy enemy={e} path={props.path} size={size} animationTable={props.animationTable} tickSpeed={props.tickSpeed}/>
                </div>
                )}
            </div>
            }
            return <div className={`${props.pathBackgrounds[index]} path`} style={{height: `${size}px`, width: `${size}px`}} key={index} />
        }

        if(props.towers.hasOwnProperty(index)) {
            return <div className='tile' style={{height: `${size}px`, width: `${size}px`}} key={index}>
                <Tower tower={props.towers[index]} size={size} newTowers={props.newTowers} index={index} towersToSell={props.towersToSell} gold={props.gold} goldDifrence={props.goldDifrence}/>
            </div>
        }

        return <div className="tile" style={{height: `${size}px`, width: `${size}px`}} key={index}>
            {showTowers(index)}
        </div>
    }

    if(towers) {
        return <div className="map">{map.map(i => tile(i))}</div>
    }
    return <div></div>
}

export default Map