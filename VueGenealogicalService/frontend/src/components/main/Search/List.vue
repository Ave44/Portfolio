<template>
  <div class="form reverseGradientBg columnFlex">
    <h1 class="title">{{ title }}</h1>
    <div class="scrollable">
      <button v-for="person in people" @click="action(person)">
        <div>
          <div>{{ person.name }}</div>
          <div class="dateNote">{{ person.birthDate }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Groups',
  props: {
    title: String,
    people: Array,
    action: Function
  }
}
</script>

<style scoped lang="scss">
.flex {
  .form {
    flex: 1;
    height: 100px;

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
}
</style>