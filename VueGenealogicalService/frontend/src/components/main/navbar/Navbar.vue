<template>
  <div class="nav">
    <div class="links">
      <NavbarLink name="TreeLayout" text="Tree" :currSubSite="currSubSite"/>
      <NavbarLink name="Social" text="Social" :currSubSite="currSubSite"/>
      <NavbarLink name="SearchMain" text="Search" :currSubSite="currSubSite"/>
    </div>
    <div @click="logout" class="link">Logout</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NavbarLink from './NavbarLink.vue'

export default {
  name: "Navbar",
  components: { NavbarLink },
  computed: {
    ...mapGetters({ currSubSite: "getCurrSubSite" })
  },
  methods: {
    ...mapActions(["storeLogout"]),

    logout() {
      this.storeLogout()
      this.$router.push({ name: "Login" });
    }
  }
}
</script>

<style scoped lang="scss">
.links {
  display: flex;
  justify-content: space-between;

  .link {
    margin-right: 50px;
  }
}

.link {
  text-decoration: none;
}
</style>