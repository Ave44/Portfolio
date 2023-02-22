import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import note from "../../images/note.png"
import filter from "../../images/filter.png"
import search from "../../images/search.png"
import { setSorting } from "../../ducks/songs/actions"
import t from "../../ducks/languages/operations";

const SongList = ({songs, sorting, setSorting}, props) => {

    const navigate = useNavigate()

    const [songsFromStore, setSongsFromStore] = useState([...songs])
    const genres = songsFromStore.reduce((prv, cur) => {return prv.includes(cur.genre) ? prv : [...prv, cur.genre]}, []).sort()
    const [genre, setGenre] = useState("All")
    const [searchText, setSearchText] = useState("")
    const [checkboxes, setCheckboxes] = useState([false, false])
    const [page, setPage] = useState(1)

    useEffect(()=>{
        const sortSongs = (s1, s2) => {
            if (s1 && s2) {
                if (sorting === "A") { return s1.title > s2.title ? 1 : -1 }
                if (sorting === "Z") { return s1.title < s2.title ? 1 : -1 }
                if (sorting === "N") { return s1.productionyear < s2.productionyear ? 1 : -1 }
                if (sorting === "O") { return s1.productionyear > s2.productionyear ? 1 : -1 }
                if (sorting === "L") { return s1.title.length < s2.title.length ? 1 : -1 }
            }
            return undefined
        }

        setSongsFromStore([...songs].sort(sortSongs))
    }, [songs, sorting])

    const filterSongs = (song) => {
        const test1 = song.title.toLowerCase().includes(searchText)
        const test2 = song.genre === genre || genre === "All" ? true : false
        const test3 = song.image === "" && checkboxes[0] === true ? false : true
        const test4 = song.video === "" && checkboxes[1] === true ? false : true
        return test1 && test2 && test3 && test4
    }

    const pages = Math.ceil(songs.filter(filterSongs).length / 8)
    const songsOnPage = songsFromStore.filter(filterSongs).slice((page - 1) * 8, (page * 8))

    const item = (song) => {
        return (
            <div className="item" key={song.title} onClick={()=>{navigate(`/music/${song.title}`)}}>
                <div className="image">
                    <img src={song.image} alt={song.title} onError={(e)=>{e.target.onError=null; e.target.src=note; e.target.className="alternateImg" }}/>
                </div>
                <div className="title">{song.title}</div>
            </div>
        )
    }

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
                {["A-Z", "Z-A", "Newest", "Oldest", "Longest Ttile"].map(item => {
                    if (sorting === item[0]) {
                        return (
                            <div key={item[0]}>
                                <input type="radio" name="sorting" value={item[0]} id={item[0]} onClick={()=>{setSorting(item[0])}} defaultChecked/>
                                <label htmlFor={item[0]} className="noSelect">{t(item)}</label>
                            </div>)
                    }
                    return (
                        <div key={item[0]}>
                            <input type="radio" name="sorting" value={item[0]} id={item[0]} onClick={()=>{setSorting(item[0])}}/>
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
                    <select className="select" id="genre" onChange={()=>{setGenre(document.getElementById('genre').value); setPage(1)}}>
                        <option value={"All"}>{t("All Genres")}</option>
                        {genres.map(g=>{return <option value={g} key={g}>{g}</option>})}
                    </select>
                    <div className="check noSelect">
                        <input type="checkbox" id="image" onClick={()=>{setCheckboxes([!checkboxes[0],checkboxes[1]])}}/>
                        <label htmlFor="image">{t("Hide ones with no image")}</label>
                    </div>
                    <div className="check noSelect">
                        <input type="checkbox" id="video" onClick={()=>{setCheckboxes([checkboxes[0],!checkboxes[1]])}}/>
                        <label htmlFor="video">{t("Hide ones with no video")}</label>
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
            <div className="list">{songsOnPage.map(song=>{return item(song)})}</div>
            {changePage(page)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return ({songs: state.songsReducer.songs, sorting: state.songsReducer.sorting, language: state.languagesReducer.language})
}

const mapDispatchToProps =  {
    setSorting
}

export default connect(mapStateToProps, mapDispatchToProps)(SongList);