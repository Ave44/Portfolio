import axios from "axios";
import store from "../store"
import { addOneSong, addMultipleSongs, deleteSong, editTheSong } from "./actions"

export const addSong = async (song) => { await axios.post('http://localhost:5000/songs', song)
.then(res => {
    store.dispatch(addOneSong(res.data))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}

export const getSongsFromApi = async () => { await axios.get('http://localhost:5000/songs')
.then(res => {
    store.dispatch(addMultipleSongs(res.data))
})
.catch(err => {
    // window.alert("Threre was a problem with connecting to database (songs)")
    console.log(err)
    throw err
})}

export const delSong = async (id) => { await axios.delete(`http://localhost:5000/songs/${id}`)
.then(res => {
    store.dispatch(deleteSong(id))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}

export const editSong = async (song) => { await axios.post(`http://localhost:5000/songs/edit/${song.id}`, song)
.then(res => {
    store.dispatch(editTheSong(song))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}