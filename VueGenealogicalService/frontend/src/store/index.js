import { createStore } from 'vuex'
import DataService from '@/services/DataService'

export default createStore({
  state: {
    user: null,
    currSubSite: null,
    currPerson: null,
    chat: null,
    socket: null,
    tokenHeader: ""
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_CURR_SUBSITE(state, currSubSite) {
      state.currSubSite = currSubSite
    },
    SET_CURR_PERSON(state, currPerson) {
      state.currPerson = currPerson
    },
    SET_CHAT(state, chat) {
      state.chat = chat
    },
    SET_SOCKET(state, socket) {
      state.socket = socket
    },
    SOCKET_DISCONNECT(state) {
      state.socket.disconnect()
      state.socket = null
    },
    SET_TOKEN_HEADER(state, tokenHeader) {
      state.tokenHeader = tokenHeader
    }
  },
  actions: {
    loginUser({ commit }, data) {
      return DataService.login(data.login, data.password)
      .then(res => {
        if(res.user) {
          commit('SET_USER', res.user)
          commit('SET_TOKEN_HEADER', res.token)
          return res.user
        }
      })
      .catch(err => {
        console.log("store",err)
        throw err
      })
    },
    createUser({ commit }, user) {
      return DataService.createUser(user)
        .then(res => {
          const newUser = res.user
          commit('SET_USER', newUser)
          commit('SET_TOKEN_HEADER', res.token)

          const person = {name: `${user.name} ${user.surname}`, birthDate: user.birthDate, gender: user.gender, userId: newUser._id}
          console.log(person)
          return DataService.createRootPerson(person)
          .then(result => {
            commit('SET_CURR_PERSON', result)
            return newUser
          })
          .catch(err => {
            console.log(err)
            throw err
          })
        })
        .catch(error => {
          throw error
        })
    },
    storeLogout({ commit }) {
      commit('SET_USER', null)
      commit('SET_CURR_SUBSITE', null)
      commit('SET_CURR_PERSON', null)
      commit('SET_CHAT', null)
      commit('SOCKET_DISCONNECT')
      commit('SET_TOKEN_HEADER', '')
    },
    storeDeletePerson({ commit }, personId) {
      DataService.deletePerson(personId)
      commit("SET_CURR_PERSON", null)
    },
    async storeCopySelected({ state }, people) {
      const userId = state.user._id
      await DataService.copyPeople(userId, people)

      const peopleToCoppyId = people.map(p => p.id)
      const relationsToCoppy = await DataService.getPeopleRelations(peopleToCoppyId)
      const fatherRelations = relationsToCoppy.filter(r => r.type == "Father")
      const motherRelations = relationsToCoppy.filter(r => r.type == "Mother")
      const possibleFatherRelations = relationsToCoppy.filter(r => r.type == "PossibleFather")
      const possibleMotherRelations = relationsToCoppy.filter(r => r.type == "PossibleMother")
      // console.log("relations to create",{fatherRelations, motherRelations, possibleFatherRelations, possibleMotherRelations})
      const createdFatherRelations = DataService.copyFatherRelations(userId, fatherRelations).then(res => { return res })
      const createdMotherRelations = DataService.copyMotherRelations(userId, motherRelations).then(res => { return res })
      const createdPossibleFatherRelations = DataService.copyPossibleFatherRelations(userId, possibleFatherRelations).then(res => { return res })
      const createdPossibleMotherRelations = DataService.copyPossibleMotherRelations(userId, possibleMotherRelations).then(res => { return res })
      const createdRelations = [createdFatherRelations, createdMotherRelations, createdPossibleFatherRelations, createdPossibleMotherRelations]
      Promise.all(createdRelations).then(res => {
        // console.log("created relations", res)
        DataService.removeOriginalIdProperty(userId)
      })
    },
    setCurrSubSite({ commit }, currSubSite) {
      commit('SET_CURR_SUBSITE', currSubSite)
    },
    setCurrPerson({ commit }, currPerson) {
      commit('SET_CURR_PERSON', currPerson)
    },
    setChat({ commit }, chat) {
      commit('SET_CHAT', chat)
    },
    setSocket({ commit }, socket) {
      commit("SET_SOCKET", socket)
    },
    setTokenHeader({ commit }, tokenHeader) {
      commit('SET_TOKEN_HEADER', tokenHeader)
    }
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getCurrSubSite(state) {
      return state.currSubSite
    },
    getCurrPerson(state) {
      return state.currPerson
    },
    getChat(state) {
      return state.chat
    },
    getSocket(state) {
      return state.socket
    },
    getTokenHeader(state) {
      return state.tokenHeader
    }
  }
})
