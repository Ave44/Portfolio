<template>
  <div class="flex">
    <h1 class="title">How do you want to search</h1>
    <div>
      <button @click="goToSearchByName" class="gradientBg"><div class="hoverable">Search by name and birth date</div></button>
      <button @click="goToSearchBySurnames" class="gradientBg"><div class="hoverable">Search by connected surnames</div></button>
    </div>
  </div>
</template>

<script>
export default {
	name: 'SearchByName',
	data() {
		return {
		}
	},
	methods: {
		goToSearchByName() {
			this.$router.push({name: 'SearchByName'})
		},
		goToSearchBySurnames() {
			this.$router.push({name: 'SearchBySurnames'})
		}
	}
}
</script>

<style scoped lang="scss">
.title {
  margin: 0;
}

button {
  padding: 0px;

  .hoverable {
    padding: 30px;
  }
}
</style>