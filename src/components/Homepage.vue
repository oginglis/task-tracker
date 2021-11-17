<template>
  <TrackerCollection />
</template>

<script  lang="ts">
// import "vue-navigation-bar/dist/vue-navigation-bar.css";
import TrackerCollection from "./TrackerCollection.vue";
// import the library
// import VueNavigationBar from "vue-navigation-bar";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Homepage",
  components: {
    // VueNavigationBar,
    TrackerCollection,
  },
  created() {},
  data: function () {
    return {};
  },
  methods: {},
});
</script>

<style scoped>
</style>
