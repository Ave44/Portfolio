<template>
  <RouterView :user="user" :selectPerson="selectPerson"/>
</template>

<script>
import DataService from '@/services/DataService'
import { mapActions } from "vuex"

export default {
  name: 'Search',
  props: {
    user: Object
  },
  methods: {
    ...mapActions(["setChat", "setCurrSubSite"]),

    async selectPerson(person) {
      const chats = await DataService.getUserChats(this.user._id)
      const chat = chats.filter(chat => chat.members.map(m => m._id).includes(person.userId))[0]
      this.setCurrSubSite('Social')
      if(chat) {
        this.setChat(chat)
        this.$router.push({name: 'FriendView'})
      } else {
        const members = [this.user._id, person.userId]
        DataService.createChat(members)
        .then(res => {
          this.setChat(res)
          this.$router.push({name: 'FriendView'})
        })
        .catch(err => { console.log(err) })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  gap: 30px;
  flex-direction: column;
  align-items: center;
  margin: 30px;
}
</style>