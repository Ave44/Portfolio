<template>
  <div class="form">
    <h1 class="title">Login</h1>
    <input v-model="login" placeholder="login"/>
    <input v-model="password" placeholder="password" type="password"/>
    <button @click="signIn">Login</button>
    <div class="note">
      <div>No account?</div>
      <router-link :to="{name: 'SignUp'}" class="link">Sign up for Free!</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: 'Login',
  data() {
    return {
      login: "",
      password: ""
    }
  },
  methods: {
    ...mapActions(["loginUser"]),

    signIn() {
      if(this.login != "" && this.password != "") {
        this.loginUser({login: this.login, password: this.password})
        .then(res => {
          this.$router.push({name: 'Layout'})
        })
        .catch(err => { alert(err.response.data.error) })
      } else {
        alert("Fill both fields before login!")
      }
    }
  }
}
</script>

<style scoped lang="scss">
.note {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  align-items: flex-end;
  margin: 15px;
  line-height: 16px;

  .link {
    font-size: inherit;
  }
}
</style>