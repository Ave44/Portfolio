<template>
	<tr>
		<template v-for="person in this.people">
			<th v-if="person != null" @click="setPerson(person)">
        <div>{{ person.name }}</div>
        <div class="dateNote">{{ person.birthDate }}</div>
      </th>
			<th v-else class="grayedOut">unknown</th>
		</template>
	</tr> 
</template>
  
<script>
export default {
	name: 'TreeRow',
	props: {
		people: Array,
		setPerson: Function
	}
}
</script>
