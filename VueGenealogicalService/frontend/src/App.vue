<template>
  <RouterView />
</template>

<script>
import { RouterView } from "vue-router"
import { mapGetters } from "vuex"

export default {
  name: 'App',
  components: {
    RouterView
},
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({ user: "getUser" })
  },
  created() {
    if(!this.user) {
      this.$router.push({name: 'Login'})
    }
  },
  methods: {
    test() {
      console.log("test")
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Epilogue");
$mainColor: rgb(32, 32, 32);
$text: rgb(255, 255, 255);
$shadow: rgb(0, 0, 0, 0.5);
$borderColor: rgb(26, 56, 61);
$fontSize: 18px;

$theme1: rgb(37, 192, 70);
$theme2: rgb(15, 100, 33, 0.5);
$contrast:rgb(0, 0, 0, 0.15);
$focus: rgb(0, 0, 0, 0.3);
$placeholder: rgb(185, 185, 185);
$speed: 200ms;

* {
  font-family: 'Epilogue';
}

body {
  margin: 0;
  background-color: $mainColor;
  color: $text;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient($theme1, $theme2);
  border-radius: 10px;
  box-shadow: -10px 10px 5px $shadow;
  width: min(400px, 70vw);
  margin: auto;
  margin-top: 15vh;

  button {
    width: 90px;
  }

  .genderButtonsFlex {
      display: flex;
      gap: 15px;
      justify-content: space-between;
      width: calc(60% + 20px);
      height: 38px;
      margin: 15px;

      .genderButton {
        flex: 1;
        padding: 10px;
        box-shadow: -4px 4px 4px $shadow;
        text-align: center;
        font-family: Consolas;
        font-size: 18px;
        font-weight: bold;
        background-color: $contrast;
        transition: $speed;
        cursor: pointer;
      }

      .genderButton:hover {
        background-color: $focus;
        transition: $speed;
      }

      .left {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      .right {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      .selected {
        background-color: $focus;

        .text {
          font-family: Consolas;
          font-size: 24px;
          position: relative;
          top: -4px;
          font-weight: bold;
        }
      }
    }
}

input {
  border-radius: 10px;
  margin: 15px;
  padding: 10px;
  border: none;
  background-color: $contrast;
  color: $text;
  font-size: $fontSize;
  box-shadow: -4px 4px 4px $shadow;
  width: 60%;
}

input::placeholder {
  color: $placeholder;
}

input:focus {
  outline: none;
  background-color: $focus;
  transition: $speed;
}

button {
  border-radius: 10px;
  margin: 15px;
  padding: 10px;
  padding-left: 14px;
  padding-right: 14px;
  border: none;
  background-color: $contrast;
  color: $text;
  font-size: $fontSize;
  box-shadow: -4px 4px 4px $shadow;
  transition: $speed;
  cursor: pointer;
}

button:hover {
  background-color: $focus;
  transition: $speed;
}

.title {
  font-size: 40px;
  text-shadow: -2px 2px 2px $shadow;
  padding: 20px;
}

.link {
  text-decoration: underline;
  color: inherit;
  font-size: $fontSize;
  cursor: pointer;
}

.link:hover {
  font-weight: bolder
}

.nav {
  background-image: linear-gradient(0.25turn, $theme1, $theme2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  padding-left: 20px;
  padding-right: 20px;
  box-shadow: 0 10px 5px $shadow;
  height: 20px;
}

.main {
  font-size: $fontSize;

  .tree {
    width: min(80%, 1000px);
    margin: auto;
    background-image: linear-gradient(0turn, $theme1, $theme2);
    box-shadow: -10px 10px 5px $shadow;

    tr {
      border-top: 6px solid $mainColor;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      margin: auto;

      th {
        border-left: 6px solid $mainColor;
        width: 100%;
        padding: 15px;
        flex: 1;
        cursor: pointer;
        transition: $speed;
      }

      th:first-child {
        border-left: none;
      }

      th:hover {
        background-color: $focus;
        transition: $speed;
      }

      .grayedOut {
        background-color: $focus;
        color: $placeholder;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
      }
    }
  }

  .addButton {
    position: absolute;
    bottom: 15px;
    right: 15px;
    font-size: 32px;
    width: 62px;
    height: 62px;
    padding: 0;
    border-radius: 100%;
    background-image: linear-gradient(0.3turn, $theme1, $theme2);
    font-weight: bold;
    transition: $speed;

    .addButtonWraper {
      transition: $speed;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .addButtonWraper:hover {
    background-color: $focus;
    transition: $speed;
  }

  .contrast {
    border-radius: 10px;
    margin: 15px;
    padding: 10px;
    border: none;
    background-color: $contrast;
    color: $text;
    font-size: $fontSize;
    box-shadow: -4px 4px 4px $shadow;
    width: 60%;
  }

  .field {
    border-radius: 10px;
  }

  .field:hover {
    background-color: $contrast;
  }

  .selected {
    background-color: $contrast;
    text-shadow: -2px 2px 2px $shadow;
  }

  .selected:hover {
    background-color: $focus;
  }

  .scrollable {
    overflow-y: auto;
    overflow-x: visible;
    max-height: 220px;
  }

  hr {
    color: $text;
  }

  .spinner {
    border: 15px solid $text;
    border-top: 15px solid $theme1;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .dateNote {
    font-size: 12px;
    position: relative;
    top: 4px;
    height: 8px;
  }

  .chat {
    background-image: linear-gradient(0.5turn, $theme1, $theme2);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    border-radius: 10px;
    box-shadow: -10px 10px 5px $shadow;

    .message {
      background-color: $contrast;
      border-radius: 10px;
      padding: 10px;
      width: fit-content;
      margin-bottom: 5px;
    }

    .message:last-child {
      margin-bottom: 0;
    }
  }

  .themeBg {
    background-color: $theme1;
  }

  .gradientBg {
    background-repeat: no-repeat;
    background-image: linear-gradient(0.5turn, $theme1, $theme2), linear-gradient(0turn, $mainColor, $mainColor);

    .hoverable {
      display: flex;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      margin: 0;
      transition: $speed;
    }
    .hoverable:hover {
      transition: $speed;
      background-color: $focus;
    }
  }

  .group {
    background-image: linear-gradient(0.5turn, $theme1, $theme2);
		border-radius: 10px;
    padding: 15px;
    box-shadow: -10px 10px 5px $shadow;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    height: 290px;
    overflow-y: auto;
  }

  .reverseGradientBg {
    background-repeat: no-repeat;
    background-image: linear-gradient(1turn, $theme1, $theme2), linear-gradient(0turn, $mainColor, $mainColor);
  }

  .topBorder {
    border: 5px solid $mainColor;
    border-top: none;
    border-left: none;
  }

  .mediaFlex {
    display: flex;
    flex: 1 1 0;
    gap: 30px;
    width: calc(100vw - 60px);
    height: calc(100vh - 50px - 60px);
    margin: 30px;
  }

  .copyButton {
    background-image: linear-gradient(0.3turn, $theme1, $theme2);
    margin: 0;
    padding: 0;
    margin-top: 30px;
    transition: $speed;

    .copyButtonWraper {
      padding: 10px;
      padding-left: 14px;
      padding-right: 14px;
      transition: $speed;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .copyButtonWraper:hover {
      background-color: $focus;
      transition: $speed;
    }
  }
}

@media screen and (max-width: 1400px) {
  .main {
    .tree {
      width: 100%;
    }

    .mediaFlex {
      flex: 1 1 0;
      flex-direction: column;

      .globalChat {
        max-height: calc(60% - 30px);
        
        .chat {
          background-image: linear-gradient(0turn, $theme1, $theme2);
        }
      }

      .flex {
        height: 40%;

        .form {
          width: 100%;
        }
      }
    }
  }
}
</style>
