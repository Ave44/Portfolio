import axios from "axios";
import store from "../store"
import { addMultipleMusicians, addOneMusician, deleteMusician, editTheMusician } from "./actions"

export const addMusician = async (musician) => { await axios.post('http://localhost:5000/musicians', musician)
.then(res => {
    store.dispatch(addOneMusician(res.data))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}

export const getMusiciansFromApi = async () => { await axios.get('http://localhost:5000/musicians')
.then(res => {
    store.dispatch(addMultipleMusicians(res.data))
})
.catch(err => {
    // window.alert("Threre was a problem with connecting to database (musicians)")
    console.log(err)
    throw err
})}

export const delMusician = async (id) => { await axios.delete(`http://localhost:5000/musicians/${id}`)
.then(res => {
    store.dispatch(deleteMusician(id))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}

export const editMusician = async (musician) => { await axios.post(`http://localhost:5000/musicians/edit/${musician.id}`, musician)
.then(res => {
    store.dispatch(editTheMusician(musician))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}