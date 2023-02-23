<template>
	<div class="form">
		<h1 class="title">Add new person</h1>
		<input v-model="name" placeholder="full name"/>
		<input v-model="birthDate" placeholder="date of birth (optional)"/>
		<div class="genderButtonsFlex">
			<div v-if="gender == 'Female'" class="left genderButton selected"><div class="text">♀</div></div>
			<div v-else class="left genderButton" @click="setGender('Female')">♀</div>
			<div v-if="gender == 'Male'" class="right genderButton selected"><div class="text">♂</div></div>
			<div v-else class="right genderButton" @click="setGender('Male')">♂</div>
		</div>
		<button @click="save">Add</button>
		<button @click="cancel">Cancel</button>
	</div>
</template>

<script>
import DataService from '@/services/DataService'

export default {
	name: 'AddPerson',
	props: {
		user: Object
	},
	data() {
		return {
			name: null,
			birthDate: "",
			gender: null
		}
	},
	methods: {
		save() {
			if(this.name, this.gender) {
				const person = {name: this.name, birthDate: this.birthDate, userId: `${this.user._id}`, gender: this.gender}
				DataService.createPerson(person)
				this.$router.push({name: "TreeLayout"})
			} else {
				alert("In order to add new person fill all necessary fields")
			}
		},
		cancel() {
			this.$router.push({name: "TreeLayout"})
		},
		setGender(gender) {
			this.gender = gender
		}
	}
}
</script>

<style scoped lang="scss">
.form {
	margin-bottom: 10vh;
	margin-top: 10vh;
}

button {
  margin-bottom: 0;
}

button:last-child {
  margin-bottom: 15px;
}
</style>