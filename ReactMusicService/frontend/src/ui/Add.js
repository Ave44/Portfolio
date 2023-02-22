import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import t from "../ducks/languages/operations";

const Sidebar = () => {

    const navigate = useNavigate()

    return (<div className="add">
        <div className="item" onClick={()=>{navigate('/add/song')}}>
            <div className="dsc">{t("Add song")}</div>
        </div>
        <div className="item" onClick={()=>{navigate('/add/musician')}}>
            <div className="dsc">{t("Add musician")}</div>
        </div>
    </div>)
}

const mapStateToProps = (state) => {
    return ({language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(Sidebar);