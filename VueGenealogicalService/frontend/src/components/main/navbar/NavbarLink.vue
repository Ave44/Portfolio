<template>
    <div v-if="current" @click="redirect" class="link bold">{{ text }}</div>
    <div v-else="current" @click="redirect" class="link">{{ text }}</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: 'NavbarLink',
  props: {
    name: String,
    text: String,
    currSubSite: String
  },
  data() {
    return {
      current: false
    }
  },
  created() {
    this.current = this.currSubSite == this.name
  },
  watch: {
    currSubSite(currSubSite) {
      this.current = currSubSite == this.name
    }
  },
  methods: {
    ...mapActions(["setCurrSubSite"]),

    redirect() {
      this.setCurrSubSite(this.name)
      this.$router.push({name: this.name})
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>