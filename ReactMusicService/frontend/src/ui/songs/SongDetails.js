import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from 'react-player'
import { useState } from "react";
import note from "../../images/note.png"
import volumeImg from "../../images/volume.png"
import { delSong } from "../../ducks/songs/operations";
import t from "../../ducks/languages/operations";

const SongDetails = ({songs, musicians, connections, setSite}, props) => {

    const navigate = useNavigate()
    const title = useParams().title
    const song = songs.filter(song => { return song.title === title ? true : false})[0]
    const [volume, setVolume] = useState(1)
    const [loaded, setLoaded] = useState(false)
    const [loadingError, setLoadingError] = useState(false)

    const [width, setWidth] = useState(window.innerWidth)
    window.onresize = () => {setWidth(window.innerWidth)}

    const volumeControler = (loaded) => {
        if (loaded) {
            return (
                <div className="volume">
                    <img src={volumeImg} alt="volume" />
                    <input type="range" min={0} max={1} step={0.01} onChange={(v)=>{setVolume(parseFloat(v.target.value))}} className="slider"/>
                    <div>{(volume * 100).toFixed()}%</div>
                </div>
            )
        }
        return <div className="volume"></div>
    }

    const player = () => {
        if (song.video && !loadingError) {
            if (width >= 900) {
                return <ReactPlayer url={song.video} volume={volume} className="video" controls={true} onReady={()=>{setLoaded(true)}} onError={()=>{setLoadingError(true)}}/>
            }
            return <ReactPlayer width={width*0.7} height={width*0.7 * 0.5625} url={song.video} volume={volume} className="video" controls={true} onReady={()=>{setLoaded(true)}} onError={()=>{setLoadingError(true)}}/>
        }
        if (loadingError) {
            return <div className="notFound">{t("there is a problem with your video link")}</div>
        }
        return <div className="notFound">{t("there is no video for this song")}</div>
    }

    const displayAuthors = () => {
        const authorIdTable = connections.map(con => {return con.songid === song.id ? con.musicianid : null})
        const authorTable = musicians.filter(musician => { return authorIdTable.includes(musician.id) })
        if (authorTable.length !== 0) {
            return authorTable.map(musician =>{return <div key={musician.id} onClick={()=> {navigate(`/musicians/${musician.name}`); setSite('Musicians')}} className="sublistitem">{musician.name}</div>})
        }
        return <div>{t("No author has been assigned")}</div>
    }

    const details = (song) => {
        if (song) {
            return (
                <div className="details">
                    <div className="head">
                        <div className="image">
                            <img src={song.image} alt={song.title} onError={(e)=>{e.target.onError=null; e.target.src=note; e.target.className="alternateImg" }}/>
                        </div>
                        <div className="info">
                            <div className="title">{song.title}</div>
                            <hr />
                            <div>{song.genre}</div>
                            <div>{song.productionyear}</div>
                            <div className="sublist">{displayAuthors()}</div>
                            <div className="buttons">
                                <button onClick={()=>{navigate(`edit`)}}>{t("edit")}</button>
                                <button onClick={()=>{delSong(song.id); navigate("/music")}}>{t("delete")}</button>
                            </div>
                        </div>
                    </div>
                    {player()}
                    {volumeControler(loaded)}
                </div>
            )
        }
        return <div className="notFound">{t("There is no such a song")}</div>
    }

    return (
        <div className="main">
            {details(song)}
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return ({songs: state.songsReducer.songs, musicians: state.musiciansReducer.musicians, connections: state.connectionsReducer.connections, setSite: ownProps.setSite, language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(SongDetails);