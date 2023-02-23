<template>
  <div class="mediaFlex">
    <div class="flex">
      <Widget title="Friends" :elements="friends" :getName="getFriendName" :action="selectFriend"/>
      <Widget title="Groups" :elements="groups" :getName="getGroupName" :action="selectGroup"/>
    </div>
    <GlobalChat :user="user"/>
  </div>
</template>

<script>
import DataService from '@/services/DataService'
import { mapActions } from "vuex"
import Widget from './Widget.vue'
import GlobalChat from './GlobalChat.vue'

export default {
  name: 'Social',
  props: {
    user: Object
  },
  components: {
    Widget,
    GlobalChat
  },
  data() {
    return {
      friends: [],
      groups: this.user.groups
    }
  },
  async created() {
    this.friends = await DataService.getUserChats(this.user._id)
  },
  methods: {
    ...mapActions(["setChat"]),

    getGroupName(group) {
      return group.name
    },
    selectGroup(group) {
      console.log(group)
      this.setChat(group)
      this.$router.push({name: 'GroupView'})
    },
    getFriendName(chat) {
      const friend = chat.members.filter(member => member._id != this.user._id)[0]
      return `${friend.name} ${friend.surname}`
    },
    selectFriend(chat) {
      this.setChat(chat)
      this.$router.push({name: 'FriendView'})
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  gap: 30px;
}
</style>