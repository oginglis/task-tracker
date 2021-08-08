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
      title: "Actions",
      htmlAttrs: { lang: "en", amp: true },
    });
  },
});
</script>

<style>
@import url("https://use.typekit.net/saf3ibf.css");

#app {
  font-family: aktiv-grotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f4f4f4;
  min-height: 100vh;
  padding: 2rem;
}
</style>
