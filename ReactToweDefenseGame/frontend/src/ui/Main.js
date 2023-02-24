import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import SaveLogs from './SaveLogs';

const Main = (props) => {
    const [minutes, setMinutes] = useState(0)
    const [victories, setVictories] = useState(0)

    useEffect(()=>{
        const time = Cookies.get('time')
        if(time) { setMinutes(time) }
        else { setMinutes(0) }

        const victories = Cookies.get('victories')
        if(victories) { setVictories(victories) }
        else { setVictories(0) }
    },[])

    useEffect(()=>{
        const timer = setInterval(() => {
            const time = parseInt(Cookies.get('time'))
            if(time) {
                setMinutes(time)
            }
        }, 30000)
        return () => clearInterval(timer)
    })

    const displayVictories = () => {
        if(victories === '1') { return <div>Today you have won {victories} game</div> }
        return <div>Today you have won {victories} games</div>
    }

    const displayMinutes = () => {
        if(minutes === '1') { return <div>Today you have been playing for {minutes} minute</div> }
        return <div>Today you have been online for {minutes} minutes</div>
    }

    return <div className="main">
        <div>{displayMinutes()}</div>
        <div>{displayVictories()}</div>
        <SaveLogs minutes={minutes} victories={victories} id={props.id}/>
    </div>
}

export default Main