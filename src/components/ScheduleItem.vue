<template>
<div>

    <li >
        <h3 class="day_header">{{dayOfWeek}}</h3><br>
        <p class="month_header">{{date}}</p>
       <TodoCreator v-if="showAdder" />

        <Tooltip position="bottom" :tooltipText="'Create action'">
            <Icon
            @iconClicked="toggleActionAdd"
            type="plus"
            class="add__action"
            />
        </Tooltip>
    </li>     

</div>
</template>

<script lang="ts">

import { defineComponent, PropType} from "vue";
import {TodoType} from "@/types/Todo";
import Tooltip from "../common/components/Tooltip.vue";
import Icon from "../common/components/Icon.vue";
import TodoCreator from "./TodoCreator.vue";

export default defineComponent({
  name: "ScheduleItem",
  created(){
     
  },
  components: {
    Tooltip,
    Icon,
    TodoCreator
  },
  props: {
      tasksForDay: {
          type: Array as PropType<Array<TodoType>>,
      },
      dayOfWeek : {
          type: String,
          default: "Today"
      },
      date: {
        type: String,
        default: "Sat Jan 12"
      }
  },
  data: function() {
      return {
          currentWeek: []  as Array<any> ,
          showAdder: false,
      }
  },
  computed: {

  },
  methods: {
      toggleActionAdd: function(): void{
          this.showAdder = !this.showAdder;
      },

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
