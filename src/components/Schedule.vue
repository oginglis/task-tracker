<template>
<div></div>
</template>

<script lang="ts">

import { defineComponent} from "vue";
import * as dayjs from 'dayjs';

export default defineComponent({
  name: "TodoList",
  created(){
      dayjs()
  },
  data: function() {
      return {
          thisWeek: null,
      }
  }
});
</script>

<style scoped>

</style>
