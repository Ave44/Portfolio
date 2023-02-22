import music from "../images/note.png"
import musician from "../images/musician.png"
import add from "../images/plus.png"
import home from "../images/home.png"
import { useNavigate } from "react-router-dom";
import t from "../ducks/languages/operations";
import { connect } from "react-redux";

const Sidebar = ({setSite, site}, props) => {

    const navigate = useNavigate()
    
    const icon = (img, name) => {
        if (site === name) {
            return <img src={img} alt={name} className="icon active"/>
        }
        return <img src={img} alt={name} className="icon"/>
    }

    return (<div className="sidebar">
        <div className="item" onClick={()=>{navigate('/'); setSite("Home")}}>
            {icon(home, "Home")}
            <div className="dsc">{t('Home')}</div>
        </div>
        <div className="item" onClick={()=>{navigate('/music'); setSite("Music")}}>
            {icon(music, "Music")}
            <div className="dsc">{t('Music')}</div>
        </div>
        <div className="item" onClick={()=>{navigate('/musicians'); setSite("Musicians")}}>
            {icon(musician, "Musicians")}
            <div className="dsc">{t('Musicians')}</div>
        </div>    
        <div className="item" onClick={()=>{navigate('/add'); setSite("Add")}}>
            {icon(add, "Add")}
            <div className="dsc">{t('Add')}</div>
        </div>
    </div>)
}

const mapStateToProps = (state, ownProps) => {
    return ({ language: state.languagesReducer.language, site: ownProps.site, setSite: ownProps.setSite})
}

export default connect(mapStateToProps)(Sidebar);