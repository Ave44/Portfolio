import { connect } from "react-redux";
import { setLanguage } from "../ducks/languages/actions"
import t from "../ducks/languages/operations";

const Topbar = ({setLanguage, site}, props) => {

    return (<div className="topbar">
        <div className="languages">
            <button onClick={()=>{setLanguage("RU")}}>RU</button>
            <button onClick={()=>{setLanguage("ENG")}}>ENG</button>
        </div>
        {t(site)}
        </div>)
}

const mapStateToProps = (state, ownProps) => {
    return ({ language: state.languagesReducer.language, site: ownProps.site})
}

const mapDispatchToProps = {
    setLanguage
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);