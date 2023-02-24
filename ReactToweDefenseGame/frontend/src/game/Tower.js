import coin from './images/coin.png';

const Tower = (props) => {
    const tower = props.tower
    const size = props.size

    let img = null
    try {
        img = require(`./images/${tower.img}.png`)
    } catch {
        img = require(`./images/unknown.png`)
    }
    const rangeImg = require(`./images/ranges/range${tower.range}.png`)

    const upgrade = (label, cost) => {
        const difrence = props.goldDifrence.reduce((pre,cur)=>{return pre + cur}, 0)
        const curGold = props.gold - difrence
        if(curGold >= cost) {
            props.newTowers.push({index: props.index, label})
            props.goldDifrence.push(cost)
        }
    }

    const upgrades = () => {
        if(tower.upgrades) {
            return <div className="upgrades" style={{height: `${size}px`, width: `${size * 3}px`, top: `${-size}px`, left: `${-size}px`}}>
                {tower.upgrades.map(e=> {
                if(props.gold >= e.cost) {
                    return <div className="upgrade" key={e.name} onClick={()=>{upgrade(e.label, e.cost)}}>
                        <div>{e.name}</div>
                        <div className='cost'>{e.cost}</div>
                        <img src={coin} alt='$' className='coin'/>
                    </div>
                }
                return <div className="upgrade gray" key={e.name} onClick={()=>{upgrade(e.label, e.cost)}}>
                        <div>{e.name}</div>
                        <div className='cost'>{e.cost}</div>
                        <img src={coin} alt='$' className='coin'/>
                    </div>
            })}
            </div>
        }
    }

    const sellTower = () => {
        props.towersToSell.push(props.index)
        props.goldDifrence.push(Math.floor(-tower.cost*0.9))
    }

    const sell = () => {
        return <div className="sellWraper" style={{height: `${size}px`, width: `${size}px`}}>
            <div className="sell" onClick={()=>{sellTower()}}>$</div>
        </div>
    }

    const range = () => {
        return <img src={rangeImg} alt='range' className="range"
        style={{width: `${7*size}px`, height: `${7*size}px`, left: `${-3*size}px`, top: `${-3*size}px`}}/>
    }

    return <div className="tower">
        {range()}
        {upgrades()}
        <img src={img} className='tower' alt={tower.name} style={{height: `${size}px`, width: `${size}px`}} />
        {sell()}
    </div>
}

export default Tower