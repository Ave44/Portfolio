<template>
  <h1 class="title">Welcome {{ user.login }}!</h1>
  <div v-if="spinner" class="spinner"></div>
  <div v-else class="tree">
    <TreeRow :people="grandparents" :setPerson="setPerson"/>
    <TreeRow :people="parents" :setPerson="setPerson"/>
    <tr v-if="person">
        <th @click="editPerson(person.id)" class="selectedPerson">
        <div>
          <div>{{ person.name }}</div>
          <div class="dateNote">{{ person.birthDate }}</div>
        </div>
        <div class="imageWraper">
          <img src="../../../../public/edit.png" alt="edit" @click="editPerson" class="edit">
        </div>
      </th>
    </tr> 
    <TreeRow v-if="children.length != 0" :people="children" :setPerson="setPerson"/>
  </div>
  <button @click="addPerson" class="addButton"><div class="addButtonWraper">+</div></button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DataService from '@/services/DataService'
import TreeRow from './TreeRow.vue'

export default {
  name: 'TreeLayout',
  props: {
    user: Object
  },
  components: {
    TreeRow
  },
  data() {
    return {
      person: null,
      parents: [null, null],
      grandparents: [null, null, null, null],
      children: [],
      spinner: true
    }
  },
  computed: {
    ...mapGetters({ currPerson: "getCurrPerson" })
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
      // console.log('NewPerson', newPerson)
      // console.log("par", this.parents)
      // console.log("grand", this.grandparents)
      // console.log("chil", this.children)
      this.spinner = false
    }
  },
  async created() {
    if(!this.currPerson) {
      this.person = await DataService.getRootPerson(this.user._id)
      this.setCurrPerson(this.person)
    } else {
      this.person = this.currPerson
    }
  },
  methods: {
    ...mapActions(["setCurrPerson"]),

    setPerson(newPerson) {
      this.person = newPerson,
      this.setCurrPerson(newPerson)
    },
    editPerson() {
      this.$router.push({name: "EditPerson"})
    },
    addPerson() {
      this.$router.push({name: "AddPerson"})
    }
  }
}
</script>

<style scoped lang="scss">
.selectedPerson {
  display: flex;
  justify-content: center;
  align-items: center;
  
  .imageWraper {
    width: 0;
    height: 18px;
    align-self: center;
    position: relative;
    left: 10px;
    justify-self: end;
    
    .edit {
      filter: invert(100%);
      user-select: none;
      width: 18px;
      height: 18px;
    }
  }
}

@media screen and (max-width: 1400px) {
  .tree {
    width: calc(100% - 60px);
  }
}
</style>