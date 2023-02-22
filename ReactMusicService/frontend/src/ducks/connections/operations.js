import axios from "axios";
import store from "../store"
import { addMultipleConnections, addOneConnection, deleteConnection } from "./actions"

export const addConnection = async (connection) => { await axios.post('http://localhost:5000/connections', connection)
.then(res => {
    store.dispatch(addOneConnection(res.data))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}

export const getConnectionsFromApi = async () => { await axios.get('http://localhost:5000/connections')
.then(res => {
    store.dispatch(addMultipleConnections(res.data))
})
.catch(err => {
    // window.alert("Threre was a problem with connecting to database (connections)")
    console.log(err)
    throw err
})}

export const delConnection = async (id) => { await axios.delete(`http://localhost:5000/connections/${id}`)
.then(res => {
    store.dispatch(deleteConnection(id))
})
.catch(err => {
    window.alert(err.response.data)
    console.log(err)
})}