<template>
<div>
    <ul>
        <li v-for="(day, index) in currentWeek" :key="index">
            <h3 class="day_header">{{checkIfToday(day,index)}}</h3><br>
            <p class="month_header">{{day.format("MMMM D") }}</p>
            <Tooltip position="bottom" :tooltipText="'Create action'">
                <Icon
                type="plus"
                class="add__action"
                />
            </Tooltip>
        </li>     
    </ul>
</div>
</template>

<script lang="ts">

import { defineComponent} from "vue";
import dayjs from 'dayjs';
import Tooltip from "../common/components/Tooltip.vue";
import Icon from "../common/components/Icon.vue";

export default defineComponent({
  name: "Schedule",
  created(){
      this.currentWeek = this.createArrayOfDays();
  },
  components: {
    Tooltip,
    Icon,
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
      },
        checkIfToday: function(day: any, index: number): String {
        let dayHumanised= "";
        switch (index){
            case 0:
                dayHumanised = "Today"
                break
            case 1:
                dayHumanised = "Tomorrow"
                break
            default: 
                dayHumanised = day.format("dddd")
        }

        return dayHumanised
        }
  }
});
</script>

<style scoped>
li {
    list-style: none;
    margin: 3rem;
    font-size: 1.2rem;
    text-align: left;
    user-select: none;
}

.day_header{ 
    font-weight: 600;
    margin: 0rem 0rem;
    font-size: 1rem;
}

.month_header {
    margin: 0rem 0rem;
    font-size: .8rem;
}
.add__action {
  padding: 1rem 2.5rem;
  border-radius: 0.8rem;
  background-color: var(--background-color);
  filter: brightness(1.1);
  transition: transform .1s ease;
  margin: 1rem;
  opacity: 0;
}

.add__action:hover {
  background-color: var(--background-color);
filter: brightness(1.1);
transform: scale(1.1);
  opacity: 1;
}
</style>
