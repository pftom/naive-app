<template>
  <n-button>Default</n-button>
  <n-button type="primary" iconPlacement="right">Default</n-button>
  <n-button type="info" dashed>Default</n-button>
  <n-button disabled type="warning"> 不许点 </n-button>
</template>

<script setup>
import NButton from "./button/src/Button.jsx";
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  margin: 5px;
}
</style>
