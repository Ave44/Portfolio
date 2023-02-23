<template>
  <div class="chat">
    <h1 v-if="title" class="title">{{ title }}</h1>
    <div class="messagesBox" id="messagesBox">
      <template v-for="data in messages">
        <div v-if="data.myMessage" class=" message myMessage">{{ formatMyMessage(data.senderName, data.message) }}</div>
        <div v-else class="message">{{ formatMessage(data.senderName, data.message) }}</div>
      </template>
    </div>
    <div class="sendContainer">
      <input v-model="text" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  props: {
    messages: Array,
    send: Function,
    formatMessage: Function,
    formatMyMessage: Function,
    title: String
  },
  data() {
    return {
      text: ""
    }
  },
  mounted() {
    const messagesBox = document.getElementById("messagesBox")
    messagesBox.scroll({ top: messagesBox.scrollHeight, behavior: "smooth"})
  },
  methods: {
    sendMessage() {
      if(this.text != "") {
        this.send(this.text)
        this.text = ""
      }
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  margin-bottom: auto;
  align-self: center;
}
.messagesBox {
  width: calc(100% - 30px);
  padding: 15px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  overflow-y: overlay;
}

.myMessage {
  align-self: flex-end;
}

.sendContainer {
  display: flex;
  justify-content: space-between;
  width: 100%;

  input {
    width: calc(100% - 80px);
    margin-right: 0px;
  }
}
</style>