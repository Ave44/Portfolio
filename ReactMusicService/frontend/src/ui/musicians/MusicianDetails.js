import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import musicianImg from "../../images/musician.png"
import { delMusician } from "../../ducks/musicians/operations";
import t from "../../ducks/languages/operations";

const MusicianDetails = ({musicians, connections, songs, setSite}, props) => {

    const navigate = useNavigate()
    const name = useParams().name
    const musician = musicians.filter(musician => { return musician.name === name ? true : false})[0]

    const displaySongs = () => {
        const songIdTable = connections.map(con => {return con.musicianid === musician.id ? con.songid : null})
        const songTable = songs.filter(song => { return songIdTable.includes(song.id) })
        if (songTable.length !== 0) {
            return songTable.map(song =>{return <div key={song.id} onClick={()=> {navigate(`/music/${song.title}`); setSite("Music")}} className="sublistitem">{song.productionyear} {song.title}</div>})
        }
        return <div>{t("This author currently doesn't have any songs")}</div>
    }

    const details = (musician) => {
        if (musician) {
            return (
                <div className="details">
                    <div className="head">
                        <div className="image">
                            <img src={musician.image} alt={musician.title} onError={(e)=>{e.target.onError=null; e.target.src=musicianImg; e.target.className="alternateImg" }}/>
                        </div>
                        <div className="info">
                            <div className="title">{musician.name}</div>
                            <hr />
                            <div>{musician.country}</div>
                            <div>{musician.year}</div>
                            <div className="buttons">
                                <button onClick={()=>{navigate(`edit`)}}>{t("edit")}</button>
                                <button onClick={()=>{delMusician(musician.id); navigate("/musicians")}}>{t("delete")}</button>
                            </div>
                        </div>
                    </div>
                    <div className="sublist sublistmargins">{displaySongs()}</div>
                </div>
            )
        }
        return <div className="notFound">{t("There is no such a musician")}</div>
    }

    return (
        <div className="main">
            {details(musician)}
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return ({musicians: state.musiciansReducer.musicians, connections: state.connectionsReducer.connections, songs: state.songsReducer.songs, setStie: ownProps.setSite, language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(MusicianDetails);