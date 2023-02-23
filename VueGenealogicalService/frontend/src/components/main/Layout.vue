<template>
	<Navbar />
  <div class="main" v-if="user">
    <RouterView :user="user"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import io from "socket.io-client"
import Navbar from './navbar/Navbar.vue'

export default {
  name: 'App',
  components: {
	Navbar
  },
  computed: {
    ...mapGetters({ user: "getUser" })
  },
  created() {
    const socket = io("http://localhost:5000")
    this.setSocket(socket)
    this.setCurrSubSite("TreeLayout")
    this.$router.push({name: 'TreeLayout'})
  },
  methods: {
    ...mapActions(["setCurrSubSite", "setSocket"])
  }
}
</script>