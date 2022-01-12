<template>
<div>
    <ul><li v-for="(day, index) in currentWeek" :key="index">
        {{day.format("dddd") }}<br>
        {{day.format("MMMM D") }}
        </li>
    </ul>


</div>
</template>

<script lang="ts">

import { defineComponent} from "vue";
import dayjs from 'dayjs';

export default defineComponent({
  name: "Schedule",
  created(){
      this.currentWeek = this.createArrayOfDays();
  },
  data: function() {
      return {
          currentWeek: []  as Array<any> ,
      }
  },
  computed: {

  },
  methods: {
      createArrayOfDays: function(): Object[]{
          let dayArray: Object[] =[];
          for(let i=0; i<=7; i++){
              dayArray.push(dayjs().add(i, 'day'));
          }
          return dayArray
      }
  }
});
</script>

<style scoped>
li {
    list-style: none;
    margin: 3rem;
    font-size: 1.2rem;
}
</style>
