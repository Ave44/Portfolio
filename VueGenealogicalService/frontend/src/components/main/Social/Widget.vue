<template>
  <div class="form">
    <h1 class="title">{{ title }}</h1>
    <div class="scrollable">
      <button v-for="element in elements" @click="action(element)">{{ getName(element) }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Groups',
  props: {
    title: String,
    elements: Array,
    getName: Function,
    action: Function
  }
}
</script>

<style scoped lang="scss">
.form {
  margin: 0;

  .title {
    padding: 0;
  }

  .scrollable {
    max-height: 100%;
    width: 100%;

    button {
      width: 80%;
      margin-left: 10%;
      margin-top: 0;
    }
  }
}
</style>