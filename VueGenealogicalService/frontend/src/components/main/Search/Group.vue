<template>
  <div class="group">
    <button v-for="person in people" @click="selectPerson(person)">
      <div>
        <div>{{ person.name }}</div>
        <div class="dateNote">{{ person.birthDate }}</div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
	name: 'Group',
	props: {
		group: Object,
    surnames: Array,
		selectPerson: Function
	},
  computed: {
    people() {
      if(this.surnames.length != 0) {
        const filteredPeople = this.group.filter(person => {
          for (const surnameIndex in this.surnames) {
            if(person.name.toLocaleLowerCase().includes(this.surnames[surnameIndex].toLocaleLowerCase())) {
              return true
            }
          }
          return false
        })
        return filteredPeople
      }
      return this.group
    }
  }
}
</script>

<style scoped lang="scss">
button {
  width: 80%;
  margin: 0;
}
</style>