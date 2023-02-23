<template>
  <div class="mediaFlex" v-if="friend">
    <div class="treeSection">
      <h1>{{ friendName }}</h1>
      <div class="content">
        <Tree :ownerId="friend._id"/>
        <div class="selecting">
          <button v-if="!copping" @click="toggleCopping" class="copyButton"><div class="copyButtonWraper">Copy part of tree</div></button>
          <template v-else>
            <div class="multiselectWraper"><Multiselect :values="allPeople" :selected="selected" :select="select" :deselect="deselect" :isSelected="isSelected" class="gradientBg"/></div>
            <button @click="copySelected" class="copyButton"><div class="copyButtonWraper">Copy selected</div></button>
            <button @click="cancelCopping" class="copyButton"><div class="copyButtonWraper">Cancel</div></button>
          </template>
        </div>
      </div>
    </div>
    <Chat :messages="messages" :send="send" :compareId="compareId" :formatMessage="formatMessage" :formatMyMessage="formatMessage"/>
  </div>
</template>

<script>
import DataService from '@/services/DataService'
import { mapGetters, mapActions } from "vuex"
import Chat from './Chat.vue'
import Tree from '../Tree/Tree.vue'
import Multiselect from './Multiselect.vue'

export default {
  name: "FriendView",
  props: {
    user: Object
  },
  components: {
    Chat,
    Tree,
    Multiselect
  },
  data() {
    return {
      messages: null,
      friend: null,
      copping: false,
      selected: [],
      allPeople: []
    }
  },
  computed: {
    ...mapGetters({ chat: "getChat", socket: "getSocket" }),

    friendName() {
      return `${this.friend.name} ${this.friend.surname}`
    },
    myName() {
      return `${this.user.name} ${this.user.surname}`
    }
  },
  async created() {
    this.messages = this.chat.history.map(data => {
      if(this.compareId(data.senderId)) {
        return {...data, myMessage: true}
      }
      return data
    })
    this.friend = this.chat.members.filter(member => member._id != this.user._id)[0]
    this.allPeople = await DataService.getAllUsersPeople(this.friend._id)
    
    // console.log(Object.keys(this.socket._callbacks), Object.keys(this.socket._callbacks).includes(`$${this.chat._id}`))
    if(!Object.keys(this.socket._callbacks).includes(`$${this.chat._id}`)) {
      console.log("creating channel")
      this.socket.emit('newChanel', {channelName: this.chat._id})
    }
    this.socket.on(`${this.chat._id}`, (data) => {
      const myMessage = this.compareId(data.senderId)
      if(myMessage) {
        data.myMessage = true
      }
      this.messages.push(data)
      this.scroll()
    })
  },
  methods: {
    ...mapActions(["storeCopySelected"]),

    send(message) {
      const data = {senderId: this.user._id, senderName: this.myName, message}
      this.socket.emit(this.chat._id, data)
      DataService.sendMessage(this.chat._id, data)
    },
    compareId(id) {
      return id == this.user._id
    },
    formatMessage(sender, text) {
      return text
    },
    toggleCopping() {
      this.copping = ! this.copping
    },
    select(person) {
      this.selected.push(person)
    },
    deselect(person) {
      this.selected = this.selected.filter(val => val.id != person.id)
    },
    isSelected(valueId) {
      return this.selected.filter(val => val.id == valueId).length != 0
    },
    copySelected() {
      this.storeCopySelected(this.selected)
      .then(res => {
        this.selected = []
        this.toggleCopping()
        alert("Coppied succesfully")
      })
      .catch(err => {
        console.log(err)
        alert("There was a problem")
      })
    },
    cancelCopping() {
      this.selected = []
      this.toggleCopping()
    },
    scroll() {
      setTimeout(() => {
        const messagesBox = document.getElementById("messagesBox")
        if(messagesBox) {
          messagesBox.scroll({ top: messagesBox.scrollHeight, behavior: "smooth"})
        }
      }, 5)
    }
  }
}
</script>

<style scoped lang="scss">
.mediaFlex {
  justify-content: space-between;

  .treeSection {
    width: calc(100% - 500px - 30px);

    .content {
      width: min(80%, 1000px);
      margin-left: auto;
      margin-right: auto;

      .tree {
        width: 100%;
      }

      .selecting {
        display: flex;
        justify-content: space-between;
        height: 38px;
        margin-top: 30px;
        position: relative;
        overflow: visible;

        .multiselectWraper {
          width: 50%;
          .contrast {
            margin: 0;
            width: 100%;
          }
        }

        button {
          margin: 0;
        }
      }
    }
  }
  .chat {
    width: 500px;
  }
}

@media screen and (max-width: 1400px) {
  .mediaFlex {

    .treeSection {
      width: 100%;
      height: auto;
      .content {
        width: 100%;
      }
    }
    .chat {
      width: 100%;
      height: calc(100% - 30px - 390px);
    }
  }
}
</style>