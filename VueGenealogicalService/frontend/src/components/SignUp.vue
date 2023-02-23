<template>
  <div class="form">
    <h1 class="title">Sign up</h1>
    <input v-model="name" placeholder="name"/>
    <input v-model="surname" placeholder="surname"/>
    <input v-model="login" placeholder="login"/>
    <input v-model="password" placeholder="password"/>
    <input v-model="birthDate" placeholder="date of birth (optionall)"/>
    <div class="genderButtonsFlex">
			<div v-if="gender == 'Female'" class="left genderButton selected"><div class="text">♀</div></div>
			<div v-else class="left genderButton" @click="setGender('Female')">♀</div>
			<div v-if="gender == 'Male'" class="right genderButton selected"><div class="text">♂</div></div>
			<div v-else class="right genderButton" @click="setGender('Male')">♂</div>
		</div>
    <button @click="createAccount">Create</button>
    <div class="note">
      <router-link :to="{name: 'Login'}" class="link">go back</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: 'SignIn',
  data() {
    return {
      name: "",
      surname: "",
      login: "",
      password: "",
      birthDate: "",
      gender: null,
      processing: false
    }
  },
  methods: {
    ...mapActions(["createUser"]),

    createAccount() {
      if(!this.processing) {
        this.processing = true
        const user = {name: this.name, surname: this.surname, login: this.login, password: this.password, birthDate: this.birthDate, gender: this.gender}
        this.createUser(user)
        .then(res => {
          if(res) {
            this.$router.push({name: 'Layout'})
          } else {
            alert("Incorrect or missing values")
          }
        })
      }
    },
    setGender(gender) {
			this.gender = gender
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