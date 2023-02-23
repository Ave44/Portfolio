<template>
  <div v-if="spinner" class="spinner"></div>
  <div v-else class="tree">
    <TreeRow :people="grandparents" :setPerson="setPerson"/>
    <TreeRow :people="parents" :setPerson="setPerson"/>
    <TreeRow :people="[person]" :setPerson="setPerson"/>
    <TreeRow v-if="children.length != 0" :people="children" :setPerson="setPerson"/>
  </div>
</template>

<script>
import DataService from '@/services/DataService'
import TreeRow from './TreeRow.vue'

export default {
  name: 'Tree',
  props: {
    ownerId: [String, Number]
  },
  components: {
    TreeRow
  },
  data() {
    return {
      person: null,
      parents: [],
      grandparents: [],
      children: [],
      spinner: true
    }
  },
  watch: {
    async person(newPerson) {
      this.parents = await DataService.getParents(newPerson.id)
      const grandparentsPromise = this.parents.map(parent => {
        if(parent) { return DataService.getParents(parent.id) }
        else { return [null, null] }
      })
      this.grandparents = await Promise.all(grandparentsPromise).then(res => {return res.flat()})
      this.children = await DataService.getChildren(newPerson.id)
      this.spinner = false
    }
  },
  async created() {
    this.person = await DataService.getRootPerson(this.ownerId)
  },
  methods: {
    setPerson(newPerson) {
      this.person = newPerson
    }
  }
}
</script>
