<template>
  <ListCollection />
</template>

<script  lang="ts">

import ListCollection from "../components/ListCollection.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Homepage",
  components: {
    // VueNavigationBar,
    ListCollection,
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
