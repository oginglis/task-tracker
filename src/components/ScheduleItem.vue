<template>
<div>
    <li >
        <h3 class="day_header">{{dayOfWeek}}</h3><br>
        <p class="month_header">{{date}}</p> 
        <p v-for="(task, index) in tasksForDay" :key="index">{{task.title}} {{task.date}} </p>
        <transition >
            <TodoCreator v-if="showAdder" :newTodoDate="day.format(`D,MMMM,YYYY`)" class="scheduleAdderStyles" @clickOutsideActionAdder="showAdder = !showAdder" @addNewAction="addActionFromSchedule"/>
        </transition>
        <Tooltip position="bottom" :tooltipText="'Create action'">
            <Icon
            @iconClicked="toggleActionAdd"
            type="plus"
            class="add__action"
            ref="iconBGColor"
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
import dayjs from 'dayjs';
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
      },
      day: {
          type: dayjs.Dayjs,
          default: dayjs()
      }
  },
  data: function() {
      return {
          currentWeek: []  as Array<any> ,
          showAdder: false,
          isMounted: false,
      }
  },
    mounted() {
    this.isMounted = true;
  },
  computed: {

  },
  methods: {
      toggleActionAdd: function(): void{
          this.showAdder = !this.showAdder;
      },
      addActionFromSchedule: function(newAction: TodoType):void {
          this.$emit("addThisFromSchedule",newAction )
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
  filter: brightness(1.8);
  transition: transform .1s ease;
  margin: 1rem;
  opacity: 0;
}

.add__action:hover {
  background-color: var(--background-color);
filter: brightness(1.1);
transform: scale(1.1);
  opacity: 1;
  cursor: pointer;
}



.scheduleAdderStyles{

    line-height: 2.2rem;
    white-space: nowrap;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
    background-color: var(--placeholder-color);
}
</style>
