<template>
  <div id="app">
    <TaskTracker />
  </div>
</template>

<script>
import TaskTracker from "./components/TaskTracker.vue";

export default {
  name: "App",
  components: {
    TaskTracker,
  },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Home",
    // all titles will be injected into this template
    titleTemplate: "%s | Task Tracker",
  },
};
</script>

<style>
@font-face {
  font-family: "MonumentGrotesk";
  src: url("assets/fonts/MonumentGrotesk-Medium.woff") format("woff");
  font-weight: medium;
}

@font-face {
  font-family: "MonumentGrotesk";
  src: url("assets/fonts/MonumentGrotesk-Regular.woff") format("woff");
  font-weight: normal;
}
#app {
  font-family: MonumentGrotesk;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
