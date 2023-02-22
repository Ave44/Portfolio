import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import musicianImg from "../../images/musician.png"
import filter from "../../images/filter.png"
import search from "../../images/search.png"
import { setMusiciansSorting } from "../../ducks/musicians/actions"
import { addConnection, delConnection } from "../../ducks/connections/operations";
import { useEffect } from "react";
import t from "../../ducks/languages/operations";

const SongAsignAuthors = ({musicians, connections, sorting, setMusiciansSorting}, props) => {
    
    const navigate = useNavigate()
    const songId = parseInt(useParams().id)
    const songTitle = useParams().title
    const [alreadyAsigned, setAlreadyAsigned] = useState([])

    const [musiciansFromStore, setMusiciansFromStore] = useState([...musicians])
    const countries = musiciansFromStore.reduce((prv, cur) => {return prv.includes(cur.country) ? prv : [...prv, cur.country]}, []).sort()
    const [country, setCountry] = useState("All")
    const [searchText, setSearchText] = useState("")
    const [checkboxes, setCheckboxes] = useState([false, false])
    const [onesWithSongs, setOnesWithSongs] = useState([])
    const [page, setPage] = useState(1)

    useEffect(()=>{
        const idTable = connections.reduce((prev,curr)=>{ return [...prev, curr.musicianid]}, [])
        const sortMusicians = (m1, m2) => {
            if (m1 && m2) {
                if (sorting === "A") { return m1.name > m2.name ? 1 : -1 }
                if (sorting === "Z") { return m1.name < m2.name ? 1 : -1 }
                if (sorting === "N") { return m1.year < m2.year ? 1 : -1 }
                if (sorting === "O") { return m1.year > m2.year ? 1 : -1 }
                if (sorting === "M") { return idTable.filter(m=>{return m === m1.id ? true : false}).length < idTable.filter(m=>{return m === m2.id ? true : false}).length ? 1 : -1 }
            }
            return undefined
        }

        setMusiciansFromStore([...musicians].sort(sortMusicians))
        setOnesWithSongs(idTable)
        setAlreadyAsigned(connections.filter(con => {return con.songid === songId ? 1 : 0}).map(con => {return con.musicianid}))
    }, [musicians, sorting, connections, songId])

    const filterMusicians = (musician) => {
        const test1 = musician.name.toLowerCase().includes(searchText)
        const test2 = musician.country === country || country === "All" ? true : false
        const test3 = musician.image === "" && checkboxes[0] === true ? false : true
        const test4 = !onesWithSongs.includes(musician.id) && checkboxes[1] === true ? false : true

        return test1 && test2 && test3 && test4
    }

    const pages = Math.ceil(musicians.filter(filterMusicians).length / 8)
    const musiciansOnPage = musiciansFromStore.filter(filterMusicians).slice((page - 1) * 8, (page * 8))

    const handleClick = (musicianId) => {
        if (alreadyAsigned.includes(musicianId)) {
            const id = connections.filter(con => {return con.songid === songId && con.musicianid === musicianId ? 1 : 0})[0].id
            delConnection(id)
        }
        else {
            addConnection({songId, musicianId})
        }
    }

    const item = (musician) => {
        if (alreadyAsigned.includes(musician.id)) {
            return(
                <div className="item selected" key={musician.name} onClick={()=>{handleClick(musician.id)}}>
                    <div className="image">
                        <img src={musician.image} alt={musician.name} onError={(e)=>{e.target.onError=null; e.target.src=musicianImg; e.target.className="alternateImg" }}/>
                    </div>
                    <div className="title">{musician.name}</div>
                </div>
        )}
        return (
            <div className="item" key={musician.name} onClick={()=>{handleClick(musician.id)}}>
                <div className="image">
                    <img src={musician.image} alt={musician.name} onError={(e)=>{e.target.onError=null; e.target.src=musicianImg; e.target.className="alternateImg" }}/>
                </div>
                <div className="title">{musician.name}</div>
            </div>
    )}

    const prevPage = (page) => {
        return page <= 1 ? <div className="empty" /> : <button onClick={()=>{setPage(page - 1)}}>{'<'}</button>
    }

    const nextPage = (page) => {
        return page >= pages ? <div className="empty" /> : <button onClick={()=>{setPage(page + 1)}}>{'>'}</button>
    }

    const changePage = (page) => {
        return (
            <div className="pages">
                {prevPage(page)}
                <div>{page}</div>
                {nextPage(page)}
            </div>
        )
    }

    const sortingOptions = () => {
        return (
            <div className="sorting">
                {["A-Z", "Z-A", "Newest", "Oldest", "Most songs"].map(item => {
                    if (sorting === item[0]) {
                        return (
                            <div key={item[0]}>
                                <input type="radio" name="sorting" value={item[0]} id={item[0]} onClick={()=>{setMusiciansSorting(item[0])}} defaultChecked/>
                                <label htmlFor={item[0]} className="noSelect">{t(item)}</label>
                            </div>)
                    }
                    return (
                        <div key={item[0]}>
                            <input type="radio" name="sorting" value={item[0]} id={item[0]} onClick={()=>{setMusiciansSorting(item[0])}}/>
                            <label htmlFor={item[0]} className="noSelect">{t(item)}</label>
                        </div>)
                })}
            </div>
        )
    }

    const filtering = () => {
        return (
            <div className="filters">
                <div className="head">
                    <div className="title">{t("Filters")}</div>
                    <img src={filter} alt="filters" className="image"/>
                </div>
                <div className="box">
                    <div className="search">
                        <input type="text" placeholder={t("Search...")} id="search" autoComplete="off"/>
                        <img src={search} alt="seatch" onClick={()=>{setSearchText(document.getElementById('search').value); setPage(1)}}/>
                    </div>
                    <select className="select" id="country" onChange={()=>{setCountry(document.getElementById('country').value); setPage(1)}}>
                        <option value={"All"}>{t("All Countries")}</option>
                        {countries.map(c=>{return <option value={c} key={c}>{c}</option>})}
                    </select>
                    <div className="check noSelect">
                        <input type="checkbox" id="image" onClick={()=>{setCheckboxes([!checkboxes[0],checkboxes[1]])}}/>
                        <label htmlFor="image">{t("Hide ones with no image")}</label>
                    </div>
                    <div className="check noSelect">
                        <input type="checkbox" id="video" onClick={()=>{setCheckboxes([checkboxes[0],!checkboxes[1]])}}/>
                        <label htmlFor="video">{t("Hide ones with no songs")}</label>
                    </div>
                    <div className="title">{t("Sorting")}</div>
                    {sortingOptions()}
                </div>
            </div>
        )
    }

    return (
        <div className="main">
            <div className="filtersHolder">{filtering()}</div>
            <button onClick={()=>{navigate(`/music/${songTitle}/edit`)}}>{t("Done")}</button>
            <div className="list">{musiciansOnPage.map(musician=>{return item(musician)})}</div>
            {changePage(page)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({musicians: state.musiciansReducer.musicians, connections: state.connectionsReducer.connections, sorting: state.musiciansReducer.sorting, language: state.languagesReducer.language})
}

const mapDispatchToProps =  {
    setMusiciansSorting
}

export default connect(mapStateToProps, mapDispatchToProps)(SongAsignAuthors);