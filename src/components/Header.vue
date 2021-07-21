<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Header",
  props: {
    title: {
      type: String,
      defult: "Hello Thered",
    },
  },
});
</script>

<style scoped>
h1 {
  color: rgb(243, 243, 243);
}
</style>
