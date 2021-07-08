<template>
  <div id="app">
    <metainfo>
      <template v-slot:title="{ content }">{{
        content ? `${content} | Task Track App` : `Task Tracker`
      }}</template>
    </metainfo>
    <TaskTracker />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import TaskTracker from "./components/TaskTracker.vue";
import { useMeta } from "vue-meta";
export default defineComponent({
  name: "App",
  components: {
    TaskTracker,
  },
  setup() {
    useMeta({
      title: "Tasks",
      htmlAttrs: { lang: "en", amp: true },
    });
  },
});
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
