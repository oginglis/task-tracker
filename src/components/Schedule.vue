<template>
<div>
    <ul>
        <ScheduleItem v-for="(day, index) in currentWeek" :key="index" :tasksForDay=findTasksForDay(day) :dayOfWeek="checkIfToday(day, index)" :date="day.format(`MMMM D`)" :day="day" @addThisFromSchedule="addTaskFromHome" />
    </ul>
</div>
</template>

<script lang="ts">

import { defineComponent, PropType} from "vue";
import dayjs from 'dayjs';

import { TodoType } from "@/types/Todo";
import ScheduleItem from "./ScheduleItem.vue";


export default defineComponent({
  name: "Schedule",
  created(){
      this.currentWeek = this.createArrayOfDays();
  },
  components: {
    ScheduleItem
  },
  data: function() {
      return {
          currentWeek: []  as Array<any> ,
      }
  },
  props: {  
      tasks: {
          type: Array as PropType<Array<TodoType>>,
          default: ()=> [  {
            "backgroundColour": "hsl(2, 73%, 43%)",
            "width": 340,
            "height": 576,
            "title": "Things to do",
            "date": "Saturday",
            "id": 1}]
        }
  },

  methods: {
      addTaskFromHome: function (todo: TodoType):void {
          this.$emit("sendTaskFromSchedule", todo)
      },
      createArrayOfDays: function(): dayjs.Dayjs[]{
          let dayArray: dayjs.Dayjs[] =[];
          for(let i=0; i<=7; i++){
              dayArray.push(dayjs().add(i, 'day'));
          }
          return dayArray
      },
      findTasksForDay: function(day:dayjs.Dayjs): Array<TodoType> {
          let selectedTasks: Array<TodoType> = [];
            selectedTasks = this.tasks.filter((task)=>{
               return task.date === day.format("D,MMMM,YYYY")
          });
          return selectedTasks
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
        return dayHumanised;
  }}
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
