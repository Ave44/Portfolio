<template>
    <div class="mediaFlex">
      <div class="treeSection">
        <h1>{{ friendName }}</h1>
        <div class="content">
          <Tree :ownerId="friend.id"/>
          <div class="selecting">
            <button v-if="!copping" @click="toggleCopping" class="copyButton"><div class="copyButtonWraper">Copy part of tree</div></button>
            <template v-else>
              <div class="multiselectWraper"><Multiselect :values="allPeople" :selected="selected" :select="select" :deselect="deselect" class="gradientBg"/></div>
              <button @click="copySelected" class="copyButton"><div class="copyButtonWraper">Copy selected</div></button>
            </template>
          </div>
        </div>
      </div>
      <Chat :messages="messages" :send="send" :compareId="compareId" :formatMessage="formatMessage" :formatMyMessage="formatMessage"/>
    </div>
  </template>
  
  <script>
  import DataService from '@/services/DataService'
  import { mapGetters } from "vuex"
  import Chat from './Chat.vue'
  import Tree from '../Tree/Tree.vue'
  import Multiselect from '../Tree/Multiselect.vue'
  
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
      ...mapGetters({ chat: "getChat" }),
  
      friendName() {
        return `${this.friend.name} ${this.friend.surname}`
      }
    },
    created() {
      const chat = DataService.getChat(this.user.id, this.chat.id)
      this.messages = chat.history
      const friendId = chat.members.filter(id => id != this.user.id)[0]
      this.friend = DataService.getUserData(friendId)
      this.allPeople = DataService.getAllPeople(friendId)
    },
    methods: {
      send(message) {
        this.messages.push({sender: this.user.id, text: message})
      },
      compareId(id) {
        return id == this.user.id
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
      copySelected() {
        DataService.copyPeople(this.user.id, this.selected)
        this.selected = []
        this.toggleCopping()
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