<template>
	<div class="flex">
    <h1 class="title">Search your relatives in others fammily trees</h1>
		<div class="form">
			<div class="rowFlex">
				<input v-model="surname" placeholder="surname"/>
				<button @click="addSurname()">add surname</button>
			</div>
			<div class="surnames">
				<div v-for="surname in surnames">
					<button @click="removeSurname(surname)">{{ surname }} 🞬</button>
				</div>
			</div>
		</div>
		<div class="groupGrid">
			<Group v-for="group in matchedGroups" :group="group" :selectPerson="selectPerson" :surnames="surnames"/>
		</div>
	</div>
</template>

<script>
import DataService from '@/services/DataService'
import Group from './Group.vue'

export default {
	name: 'SearchByName',
	props: {
		user: Object,
		selectPerson: Function
	},
	components: {
		Group
	},
	data() {
		return {
			peopleGroups: [],
			surname: "",
			surnames: []
		}
	},
	computed: {
		matchedGroups() {
			const filteredGroups = this.peopleGroups.filter(group => {
				const names = group.map(p => p.name).join(" ").toLowerCase()
				// console.log("names", names)
				for (const surnameIndex in this.surnames) {
					if(!names.includes(this.surnames[surnameIndex].toLocaleLowerCase())) {
						return false
					}
				}
				return true
			})
			// console.log(filteredGroups)
			return filteredGroups
		}
	},
	created() {
		DataService.getAllPeople()
		.then(res => {
			const grouppedPeople = res.reduce((acc, cur) => {
				if(acc[cur.userId]) {
					acc[cur.userId].push(cur)
				} else {
					acc[cur.userId] = [cur]
				}
				return acc
			}, {})
			this.peopleGroups = Object.values(grouppedPeople)
			// console.log(grouppedPeople, this.peopleGroups)
		})
	},
	methods: {
		addSurname() {
			if(this.surname != "") {
				this.surnames.push(this.surname)
				this.surname = ""
			}
		},
		removeSurname(surname) {
			this.surnames = this.surnames.filter(s => s != surname)
		}
	}
}
</script>

<style scoped lang="scss">
.flex {

	.title {
		margin: 0;
	}

	.form {
		margin-top: 0;
		padding: 15px;
		width: min(1000px, calc(100% - 90px));

		.surnames {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			justify-content: flex-start;

			button {
				width: auto;
			}
		}
	}

	.rowFlex {
		display: flex;
		width: 100%;
		flex-direction: row;
		margin-bottom: 0;
	
		input {
			flex: 1;
		}
		button {
			width: auto;
		}
	}

	.groupGrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: min(1030px, calc(100% - 60px));
		gap: 30px;
	}
}
</style>