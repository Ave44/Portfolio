<template>
  <div class="globalChat">
    <Chat :messages="messages" :send="send" :formatMessage="formatMessage" :formatMyMessage="formatMyMessage" title="Global chat"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Chat from './Chat.vue'

export default {
  name: "GlobalChat",
  components: {
    Chat
  },
  computed: {
    ...mapGetters({ socket: "getSocket" }),
    sender() {
      return `${this.user.name} ${this.user.surname}`
    }
  },
  props: {
    user: Object
  },
  data() {
    return {
      messages: []
    }
  },
  created() {
    this.socket.on("global", (data) => {
      const myMessage = this.compareId(data.senderId)
      if(myMessage) {
        data.myMessage = true
      }
      this.messages.push(data)
      this.scroll()
    })
  },
  methods: {
    send(message) {
      this.socket.emit("global", {senderId: this.user._id, senderName: this.sender, message})
    },
    compareId(id) {
      return id == this.user._id
    },
    formatMessage(senderName, text) {
      return `${senderName}: ${text} `
    },
    formatMyMessage(senderName, text) {
      return `${text} :you`
    },
    scroll() {
      setTimeout(() => {
        const messagesBox = document.getElementById("messagesBox")
        messagesBox.scroll({ top: messagesBox.scrollHeight, behavior: "smooth"})
      }, 5)
    }
  }
}
</script>

<style scoped lang="scss">
.globalChat {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>