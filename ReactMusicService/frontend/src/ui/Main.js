import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PieChart } from "react-minimal-pie-chart";
import musicianImg from "../images/musician.png"
import t from "../ducks/languages/operations";

const Main = ({songs, musicians, connections, setSite}, props) => {

    const navigate = useNavigate()
    const [musicianWithMostSongs, setMusicianWithMostSongs] = useState([])
    const [songsByYears, setSongsByYears] = useState([])
    const [songsWithAuthor, setSongsWithAuthor] = useState([])
    const [songsByGenres, setSongsByGenres] = useState([])

    const getMostCommonValue = (arr) => {
        const object = arr.reduce((pre, cur)=>{
            if(pre.hasOwnProperty(cur)) {
                return {...pre, [cur]: pre[cur] + 1}
            }
            return {...pre, [cur]: 1}
        }, {})
        const objectByKeys = Object.keys(object)
        const id = objectByKeys.reduce((pre,cur)=>{return object[cur] > object[pre] ? cur : pre},objectByKeys[0])
        return [parseInt(id), object[id]]
    }

    useEffect(()=>{
            setMusicianWithMostSongs(getMostCommonValue(connections.map(e=>e.musicianid)))
            setSongsByYears(songs.map(s=>{return s.productionyear.split("-")[0]}))
            setSongsWithAuthor([...new Set(connections.map(e=>e.songid))])
            setSongsByGenres(songs.map(s=>s.genre))
        },[connections, songs])
        
    const showMusicianWithMostSongs = () => {
        if(musicianWithMostSongs[0] && musicianWithMostSongs[1]) {
            const musician = musicians.filter(m=>{return m.id === musicianWithMostSongs[0]})[0]
            if(musician) {
                return (<div className="item">
                    <div className="title">{t("Musician with most songs:")}</div>
                    <img src={musician.image} alt={musician.name} className="image" onError={(e)=>{e.target.onError=null; e.target.src=musicianImg; e.target.className="alternateImg" }}/>
                    <div>
                        <div className="title hoverableTitle" onClick={()=>{navigate(`/musicians/${musician.name}`); setSite("Musicians")}}>{musician.name}</div>
                        <div>{t("with")} {musicianWithMostSongs[1]} {t("songs")}</div>
                    </div>
                </div>)}}
        return <div className="item">...</div>
    }

    const showLineChart = () => {
        const years = songsByYears.reduce((obj, b) => {obj[b] = ++obj[b] || 1; return obj}, {})
        const start = parseInt(Object.keys(years)[0])
        const end = parseInt(Object.keys(years).slice(-1)[0])
        const allYears = []
        for (var i = start; i <= end; i++) { allYears.push(i)}
        const dataKey = t("ammount")
        const data = allYears.map(e=>{return {year: e, [dataKey]: years[e] ? years[e] : 0}})
        const maxValue = data.reduce((pre,cur)=>{return cur[dataKey] > pre ? cur[dataKey] : pre}, 0)

        return (
            <div className="item">
                <div className="title">{t("Songs released each year")}</div>
                <BarChart width={600} height={300} data={data} maxBarSize={5} margin={{bottom: 50}}>
                    <Bar dataKey={dataKey} fill="#00ff62" />
                    <XAxis dataKey="year" angle={-70} textAnchor="end" interval={5}/>
                    <YAxis domain={[0, maxValue+1]} tickLine={false} axisLine={false} tick={false}/>
                    <Tooltip />
                </BarChart>
            </div>)
    }

    const showSongsWithoutAuthor = () => {
        const songsWithoutAuthor = songs.reduce((pre,cur)=>{return songsWithAuthor.includes(cur.id) ? pre : [...pre, cur]},[])
        if(songsWithoutAuthor.length === 1) {
            return (<div className="item">
                <div className="title">{t("Currently only one songs don't have an author assigned")}</div>
                {songsWithoutAuthor.map(e=>{return <div key={e.title} onClick={()=>{navigate(`/music/${e.title}`); setSite("Music")}} className="song">{e.title}</div>})}
            </div>)
        }
        if(songsWithoutAuthor.length > 0) {
            return (<div className="item">
                <div className="title">{t("Currently")} {songsWithoutAuthor.length} {t("songs don't have an author assigned!")}</div>
                {songsWithoutAuthor.map(e=>{return <div key={e.title} onClick={()=>{navigate(`/music/${e.title}`); setSite("Music")}} className="song">{e.title}</div>})}
            </div>)
        }
        return <div className="item"><div className="bold">{t("Congratulations all the songs have an author assigned, Good Job!")}</div></div>
    }

    const showPieChart = () => {
        const genres = songsByGenres.reduce((pre,cur)=>{pre[cur] = ++pre[cur] || 1; return pre},{})
        const data = []
        const colors = ["#999999", "#777777" , "#555555" ,"#444444", "#222222", "#111111"]
        for(const [key, value] of Object.entries(genres)) {data.push({key: key, title: key, value: value, color: colors[data.length % 6]})}
        return <div className="item">
            <div className="title">{t("All genres by percentage")}</div>
            <div className="title">{'&'} {t("number of all songs")}</div>
            <div className="pieChart">
                <div>
                    <PieChart 
                        center={[50, 50]}
                        data={data}
                        label={(props) => { return `${props.dataEntry.title}`;}}
                        labelStyle={{fontSize: "3px", fill: "#00ff62"}}
                        labelPosition={110}
                        lengthAngle={360}
                        lineWidth={25}
                        paddingAngle={3}
                        radius={30}
                        startAngle={0}
                        viewBoxSize={[100, 100]}/>
                    <div className="center">
                        <div>
                            <PieChart 
                            center={[50, 50]}
                            data={data}
                            label={(props) => { return `${(props.dataEntry.value/songs.length * 100).toFixed(1)+"%"}`;}}
                            labelStyle={{fontSize: "3px", fill: "#00ff62"}}
                            labelPosition={90}
                            lengthAngle={360}
                            lineWidth={25}
                            paddingAngle={3}
                            radius={28}
                            startAngle={0}
                            viewBoxSize={[100, 100]}/>
                        </div>
                    </div>
                    <div className="center2">{songs.length}</div>
                </div>
            </div>
            
        </div>
    }

    return (
        <div className="main">
            <div className="home">
                {showMusicianWithMostSongs()}
                {showLineChart()}
                {showPieChart()}
                {showSongsWithoutAuthor()}
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return ({songs: state.songsReducer.songs, musicians: state.musiciansReducer.musicians, connections: state.connectionsReducer.connections, setStie: ownProps.setSite, language: state.languagesReducer.language})
}

export default connect(mapStateToProps)(Main);