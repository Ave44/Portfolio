const Enemy = (props) => {
    const enemy = props.enemy
    const tickSpeed = props.tickSpeed
    const animation = props.animationTable[Math.floor(enemy.position)]
    const size = props.size

    let img = null
    try {
        img = require(`./images/${enemy.img}.png`)
    } catch {
        img = require(`./images/unknown.png`)
    }

    const calculateOffset = () => {
        const offset = parseInt(enemy.position * size) % size
        
        if(animation === "moveRight") { return {top: size*0.25, left: 0 + offset } }
        if(animation === "moveLeft") { return {top: size*0.25, left: size - offset } }
        if(animation === "moveUp") { return {top: size*0.75 - offset, left: size*0.5} }
        if(animation === "moveDown") { return {top: -size*0.25 + offset, left: size*0.5} }

        if(animation === "moveDownRight") { return {top: -size*0.25 + offset / 2, left: size*0.5 + offset / 2 } }
        if(animation === "moveDownLeft") { return {top: -size*0.25 + offset / 2, left: size*0.5 - offset / 2} }

        if(animation === "moveUpRight") { return {top: size*0.75 - offset / 2, left: size*0.5 + offset / 2} }
        if(animation === "moveUpLeft") { return {top: size*0.75 - offset / 2, left: size*0.5 - offset / 2} }

        if(animation === "moveRightDown") { return {top: size*0.25 + offset / 2, left: 0 + offset / 2} }
        if(animation === "moveRightUp") { return {top: size*0.25 - offset / 2, left: 0 + offset / 2} }

        if(animation === "moveLeftDown") { return {top: size*0.25 + offset / 2, left: size - offset / 2} }
        if(animation === "moveLeftUp") { return {top: size*0.25 - offset / 2, left: size - offset / 2} }

        return {top:0,left:0}
    }

    const offset = calculateOffset()

    const displayHp = () => {
        if(enemy.hp !== enemy.maxhp) {
            const percentageOfLostHp = enemy.hp/enemy.maxhp
            const hpWidth = parseInt(30 * percentageOfLostHp)
            const lostHpWidth = 30 - hpWidth
            return <div className="hpBar">
                <div className="green" style={{width: `${hpWidth}px`}}/>
                <div className="gray" style={{width: `${lostHpWidth}px`}}/>
            </div>
        }
    }

    return <div className="enemy" style={{ top: `${offset.top + enemy.offsetX - size*0.5}px`, left: `${offset.left + enemy.offsetY}px`,
    animationName: `${animation}`, animationDuration: `${tickSpeed / enemy.speed}ms` }}>
        {displayHp()}
        <img src={img} alt={props.img} style={{width: `${size}px`}}/>
    </div>
}

export default Enemy