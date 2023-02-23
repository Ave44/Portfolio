<template>
	<div class="form">
		<h1 class="title">Edit {{ person.name }}</h1>
		<input v-model="name" placeholder="full name"/>
		<input v-model="birthDate" placeholder="date of birth (optional)"/>
		<label>Mother</label>
    <Select :values="allFemale" :selected="mother" :select="setMother"/>
    <label>Father</label>
    <Select :values="allMale" :selected="father" :select="setFather"/>
    <label>Children</label>
		<Multiselect :values="allPeople" :selected="children" :select="selectChildren" :deselect="deselectChildren"/>
    <label>Possible Mother</label>
		<Multiselect :values="allFemale" :selected="possibleMother" :select="selectPossibleMother" :deselect="deselectPossibleMother"/>
    <label>Possible Father</label>
		<Multiselect :values="allMale" :selected="possibleFather" :select="selectPossibleFather" :deselect="deselectPossibleFather"/>
    <button @click="save">Save</button>
    <button @click="cancel">Cancel</button>
    <button v-if="!person.rootNode" @click="deletePerson">Delete</button>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DataService from '@/services/DataService'
import { toRaw } from 'vue'
import Multiselect from './Multiselect.vue'
import Select from './Select.vue'

export default {
	name: 'EditPerson',
  components: {
    Multiselect, Select
  },
  props: {
    user: Object
  },
	data() {
		return {
			name: "",
			birthDate: null,
			mother: null,
      possibleMother: [],
			father: null,
      possibleFather: [],
			children: [],
      allPeople: [],
      allFemale: [],
      allMale: [],
      oldData: {}
		}
	},
  computed: {
    ...mapGetters({ currPerson: "getCurrPerson" })
  },
	async created() {
    this.person = this.currPerson
    this.name = this.person.name
    this.birthDate = this.person.birthDate
		this.mother = await DataService.getMother(this.person.id)
		this.father = await DataService.getFather(this.person.id)
    this.possibleMother = await DataService.getPossibleMother(this.person.id)
		this.possibleFather = await DataService.getPossibleFather(this.person.id)
		this.children = await DataService.getChildren(this.person.id)
    this.allPeople = await DataService.getAllUsersPeople(this.user._id)
    this.allFemale = await DataService.getAllUsersFemale(this.user._id)
    this.allMale = await DataService.getAllUsersMale(this.user._id),
    this.oldData = {person: {name: toRaw(this.name), birthDate: toRaw(this.birthDate)},
                    mother: toRaw(this.mother), father: toRaw(this.father),
                    children: [...toRaw(this.children)], possibleMother: [...toRaw(this.possibleMother)], possibleFather: [...toRaw(this.possibleFather)]}
	},
	methods: {
    ...mapActions(["storeDeletePerson", "setCurrPerson"]),

		async save() {
      const person = {id: this.person.id, name: toRaw(this.name), birthDate: toRaw(this.birthDate), userId: this.person.userId}
      const newData = {person, mother: toRaw(this.mother), father: toRaw(this.father), children: toRaw(this.children), possibleMother: toRaw(this.possibleMother), possibleFather: toRaw(this.possibleFather)}
      // console.log({old: toRaw(this.oldData), new: newData})
      await DataService.saveChanges(this.person.id, this.oldData, newData)
      if(this.person.rootNode) {
        this.setCurrPerson({...person, rootNode: true})
      } else {
        this.setCurrPerson(person)
      }
			this.$router.push({name: "TreeLayout"})
		},
    cancel() {
      this.$router.push({name: "TreeLayout"})
    },
    async deletePerson() {
      this.storeDeletePerson(this.person.id)
      this.$router.push({name: "TreeLayout"})
    },
    setMother(value) {
      this.mother = value
    },
    setFather(value) {
      this.father = value
    },
    selectChildren(value) {
      this.children.push(value)
    },
    deselectChildren(value) {
      this.children = this.children.filter(val => val.id != value.id)
    },
    selectPossibleMother(value) {
      this.possibleMother.push(value)
    },
    deselectPossibleMother(value) {
      this.possibleMother = this.possibleMother.filter(val => val.id != value.id)
    },
    selectPossibleFather(value) {
      this.possibleFather.push(value)
    },
    deselectPossibleFather(value) {
      this.possibleFather = this.possibleFather.filter(val => val.id != value.id)
    }
	}
}
</script>

<style scoped lang="scss">
.form {
	margin-bottom: 30px;
	margin-top: 30px;

	label {
		align-self: flex-start;
		margin-left: 18%;
    position: relative;
    top: 10px;
	}

  button {
    margin-bottom: 0;
  }

  button:last-child {
    margin-bottom: 15px;
  }
}
</style>