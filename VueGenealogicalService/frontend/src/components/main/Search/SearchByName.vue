<template>
  <div class="flex">
    <h1 class="title">Search your relatives in others fammily trees</h1>
    <div class="form rowFlex">
      <input v-model="name" placeholder="name"/>
      <input v-model="birthDate" placeholder="birth date (optional)" />
      <button @click="search()">search</button>
    </div>
    <List v-if="matchedPeople.length != 0" title="Matching:" :people="matchedPeople" :action="selectPerson"/>
  </div>
</template>

<script>
import DataService from '@/services/DataService'
import List from './List.vue'

export default {
	name: 'SearchByName',
	props: {
		user: Object,
		selectPerson: Function
	},
	components: {
		List
	},
	data() {
		return {
			matchedPeople: [],
			name: "",
			birthDate: ""
		}
	},
	methods: {
		search() {
			DataService.searchPeople(this.name, this.birthDate)
			.then(res => {
				this.matchedPeople = res.filter(person => person.userId != this.user._id)
			})
		}
	}
}
</script>

<style scoped lang="scss">
.flex {
	height: calc(100vh - 50px - 60px);

	.title {
		margin: 0;
	}

	.form {
		margin-top: 0;
		padding: 15px;
		width: min(1000px, calc(100% - 90px));
	}

	.rowFlex {
		flex-direction: row;
	}
}
</style>