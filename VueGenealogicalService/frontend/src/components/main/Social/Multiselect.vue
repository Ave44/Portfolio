<template>
    <div class="contrast">
      <div class="flex" @click="toggleOpen">
        <div>Selected: {{ title }}</div>
        <div v-if="open" class="arrowUp">⯅</div>
        <div v-else>⯆</div>
      </div>
      <div v-if="open">
        <hr />
        <input v-model="pattern" placeholder="search"/>
        <div class="scrollable">
          <div v-for="value in values" class="noPadding">
            <div v-if="filterValue(value.name) && isSelected(value.id)" @click="deselect(value)" class="field selected">
              {{ value.name }}
            </div>
            <div v-else-if="filterValue(value.name)" @click="select(value)" class="field">
              {{ value.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
      name: 'Multiselect',
      props: {
      values: Array,
      selected: Array,
      select: Function,
      deselect: Function,
      isSelected: Function
      },
      data() {
          return {
        open: false,
        pattern: ""
          }
      },
    computed: {
      title() {
        return this.selected.length
      }
    },
    methods: {
      toggleOpen() {
        this.open = !this.open
      },
      filterValue(value) {
        return value.toUpperCase().includes(this.pattern.toUpperCase())
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .contrast {
    padding: 0;
    width: calc(60% + 20px);
  
    input {
      width: 80%;
      margin-bottom: 10px;
    }
  
    .field {
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    }
  
    .selected {
      font-weight: bold;
    }
  }
  
  hr {
    margin: 0;
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    line-height: 18px;
    cursor: pointer;
  
    .arrowUp {
      position: relative;
      top: 3px;
    }
  }
  </style>