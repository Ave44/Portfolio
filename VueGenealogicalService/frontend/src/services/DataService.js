import axios from 'axios'
import store from '../store/index'

const dbUrl = 'http://localhost:5000'
const peopleUrl = `${dbUrl}/people`

axios.interceptors.request.use((config) => {
    const tokenHeader = store.getters.getTokenHeader
    config.headers['Authorization'] = tokenHeader
    // console.log({tokenHeader, config})
    return config
}, function (error) {
    return Promise.reject(error)
})

export default {
    login(login, password) {
        return axios.post(`${dbUrl}/unprotected/login`, {login, password})
        .then(res => { return res.data })
        .catch(err => { throw err })
    },
    createUser(user) {
        return axios.post(`${dbUrl}/unprotected`, user)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    createRootPerson(person) {
        return axios.post(`${peopleUrl}/root`, person)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getUserChats(userId) {
        return axios.get(`${dbUrl}/chats/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    sendMessage(chatId, data) {
        return axios.put(`${dbUrl}/chats/${chatId}`, data)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getUserData(userId) {
        return axios.get(`${dbUrl}/users/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getRootPerson(userId) {
        return axios.get(`${peopleUrl}/root/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getPerson(personId) {
        return axios.get(`${peopleUrl}/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getMother(personId) {
        return axios.get(`${peopleUrl}/mother/${personId}`)
        .then(res => { 
            if(res.data) { return res.data }
            return null })
        .catch(err => { console.log(err) })
    },
    getFather(personId) {
        return axios.get(`${peopleUrl}/father/${personId}`)
        .then(res => { 
            if(res.data) { return res.data }
            return null })
        .catch(err => { console.log(err) })
    },
    getPossibleMother(personId) {
        return axios.get(`${peopleUrl}/possibleMother/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getPossibleFather(personId) {
        return axios.get(`${peopleUrl}/possibleFather/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getParents(personId) {
        return axios.get(`${peopleUrl}/parents/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getChildren(personId) {
        return axios.get(`${peopleUrl}/children/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getAllUsersPeople(userId) {
        return axios.get(`${peopleUrl}/user/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getAllUsersFemale(userId) {
        return axios.get(`${peopleUrl}/user/female/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getAllUsersMale(userId) {
        return axios.get(`${peopleUrl}/user/male/${userId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    createPerson(person) {
        return axios.post(`${peopleUrl}`, person)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    async saveChanges(personId, oldData, newData) {
        if(newData.person.name != oldData.person.name || newData.person.birthDate != oldData.person.birthDate) {
            await axios.put(`${peopleUrl}/${personId}`, newData.person)
            .then(res => { return res.data })
            .catch(err => { console.log(err) })
        }
        if(newData.father) {
            if(!oldData.father) {
                await axios.post(`${peopleUrl}/relations/setFather`, {childId: personId, fatherId: newData.father.id})
                .then(res => { return res.data })
                .catch(err => { console.log(err) })
            }
            else if(newData.father.id != oldData.father.id) {
                const data = {childId: personId, newFatherId: newData.father.id, oldFatherId: oldData.father.id}
                await axios.put(`${peopleUrl}/relations/updateFather`, data)
                .then(res => { return res.data })
                .catch(err => { console.log(err) })
            }
        }
        if(newData.mother) {
            if(!oldData.mother) {
                await axios.post(`${peopleUrl}/relations/setMother`, {childId: personId, motherId: newData.mother.id})
                .then(res => { return res.data })
                .catch(err => { console.log(err) })
            }
            else if(newData.mother.id != oldData.mother.id) {
                const data = {childId: personId, newMotherId: newData.mother.id, oldMotherId: oldData.mother.id}
                await axios.put(`${peopleUrl}/relations/updateMother`, data)
                .then(res => { return res.data })
                .catch(err => { console.log(err) })
            }
        }
        const oldChildrenId = oldData.children.map(c => c.id)
        const newChildrenId = newData.children.map(c => c.id)
        const childrenToAdd = newChildrenId.filter(c => !oldChildrenId.includes(c))
        const childrenToDel = oldChildrenId.filter(c => !newChildrenId.includes(c))
        // console.log("+", childrenToAdd, "\n-", childrenToDel)
        if(childrenToAdd.length > 0) {
            await axios.post(`${peopleUrl}/relations/setChildren`, {personId, childrenId: childrenToAdd})
        }
        if(childrenToDel.length > 0) {
            await axios.delete(`${peopleUrl}/relations/delChildren`, {data: {personId, childrenId: childrenToDel}})
        }

        const oldPossibleMothersId = oldData.possibleMother.map(m => m.id)
        const newPossibleMothersId = newData.possibleMother.map(m => m.id)
        const possibleMothersToAdd = newPossibleMothersId.filter(m => !oldPossibleMothersId.includes(m))
        const possibleMothersToDel = oldPossibleMothersId.filter(m => !newPossibleMothersId.includes(m))
        // console.log("+", possibleMothersToAdd, "\n-", possibleMothersToDel)
        if(possibleMothersToAdd.length > 0) {
            await axios.post(`${peopleUrl}/relations/setPossibleMothers`, {possibleChildId: personId, possibleMothersId: possibleMothersToAdd})
        }
        if(possibleMothersToDel.length > 0) {
            await axios.delete(`${peopleUrl}/relations/delPossibleMothers`, {data: {possibleChildId: personId, possibleMothersId: possibleMothersToDel}})
        }

        const oldPossibleFathersId = oldData.possibleFather.map(f => f.id)
        const newPossibleFathersId = newData.possibleFather.map(f => f.id)
        const possibleFathersToAdd = newPossibleFathersId.filter(f => !oldPossibleFathersId.includes(f))
        const possibleFathersToDel = oldPossibleFathersId.filter(f => !newPossibleFathersId.includes(f))
        // console.log("+", possibleFathersToAdd, "\n-", possibleFathersToDel)
        if(possibleFathersToAdd.length > 0) {
            await axios.post(`${peopleUrl}/relations/setPossibleFathers`, {possibleChildId: personId, possibleFathersId: possibleFathersToAdd})
        }
        if(possibleFathersToDel.length > 0) {
            await axios.delete(`${peopleUrl}/relations/delPossibleFathers`, {data: {possibleChildId: personId, possibleFathersId: possibleFathersToDel}})
        }
    },
    deletePerson(personId) {
        return axios.delete(`${peopleUrl}/${personId}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getAllPeople() {
        return axios.get(`${peopleUrl}`)
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    copyPeople(userId, selectedPeople) {
        return axios.post(`${peopleUrl}/copyPeople`, {userId, selectedPeople})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    getPeopleRelations(peopleToCoppyId) {
        return axios.post(`${peopleUrl}/relations/getPeopleRelations`, {peopleToCoppyId})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    copyFatherRelations(userId, fatherRelations) {
        return axios.post(`${peopleUrl}/relations/copyFatherRelations`, {userId, fatherRelations})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    copyMotherRelations(userId, motherRelations) {
        return axios.post(`${peopleUrl}/relations/copyMotherRelations`, {userId, motherRelations})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    copyPossibleFatherRelations(userId, possibleFatherRelations) {
        return axios.post(`${peopleUrl}/relations/copyPossibleFatherRelations`, {userId, possibleFatherRelations})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    copyPossibleMotherRelations(userId, possibleMotherRelations) {
        return axios.post(`${peopleUrl}/relations/copyPossibleMotherRelations`, {userId, possibleMotherRelations})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    removeOriginalIdProperty(userId) {
        return axios.post(`${peopleUrl}/removeOriginalIdProperty`, {userId})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },

    searchPeople(name, birthDate) {
        return axios.post(`${peopleUrl}/search`, {name, birthDate})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
    createChat(members) {
        return axios.post(`${dbUrl}/chats`, {members})
        .then(res => { return res.data })
        .catch(err => { console.log(err) })
    },
};
