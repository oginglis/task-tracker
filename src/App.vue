<template>
  <div id="app">
    <TaskTracker />
  </div>
</template>

<script>
import TaskTracker from './components/TaskTracker.vue'

export default {
  name: 'App',
  components: {
    TaskTracker
  }
}
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
</style>
