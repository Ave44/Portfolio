import { useHistory } from "react-router-dom";

const Topbar = () => {
    const history = useHistory()

    return <div className="topbar">
        <div onClick={()=>{history.push('/')}} className="button">Main</div>
        <div onClick={()=>{history.push('/enemies')}} className="button">Enemies</div>
        <div onClick={()=>{history.push('/towers')}} className="button">Towers</div>
        <div onClick={()=>{history.push('/levels')}} className="button">Levels</div>
    </div>
}

export default Topbar