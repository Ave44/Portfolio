import heart from './images/heart.png'
import coin from './images/coin.png';
import skull from './images/skull.png'

const Statistics = (props) => {

    const nextWaveButton = () => {
        if(props.next && !props.lastWave) {
            return <div onClick={()=>{props.nextWave()}}>next wave</div>
        }
    }

    return <div className='statistics'>
        <div className='statistic'>
            <div>Hp</div>
            <div className='margins'>{props.hp}</div>
            <img src={heart} alt='♡' className="image"/>
        </div>
        <div className='statistic'>
            <div>Gold</div>
            <div className='margins'>{props.gold}</div>
            <img src={coin} alt='coin' className="image"/>
            </div>
        <div className='statistic'>
            <div>Wave</div>
            <div className='margins'>{props.wave}</div>
            <img src={skull} alt='coin' className="image"/>
        </div>
        {nextWaveButton()}
    </div>
}

export default Statistics