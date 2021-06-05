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
@font-face {
  font-family: "MonumentGrotesk";
  src: url(/fonts/MonumentGrotesk-Medium.otf) format('font-opentype') ;
  font-weight: medium;

}

@font-face {
  font-family: "MonumentGrotesk";
  src: url(/fonts/MonumentGrotesk-Regular.otf) format('font-opentype') ;
  font-weight: normal;

}
#app {
  font-family: MonumentGrotesk-Regular, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
