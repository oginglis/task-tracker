<template>
    <div>
        <Task v-for="(task, index) in info" @toggleReminda="convertRemind(task)" :title="task.title" :date="task.date" :reminder="task.reminder.toString()" :key="task.id" :id="task.id" v-on:askToDeleteTask2="deleteTask" v-on:askToUpdateTask2="askToUpdateTask3" :taskColor="colours[index]"/>
    </div>
</template>

<script>

import Task from './Task.vue'
import axios from 'axios'
import Gradient from 'javascript-color-gradient'


export default {
    name: "TaskList",
    components: {
        Task,
    },
    data(){
      return {
        info: null,
        colours: [],
      }
    },
    props: {
        taskData: Object,
    },
    mounted(){
        axios
        .get('http://localhost:3000/tasks')
        .then((response) => {
          this.info = response.data
          let colorGradient = new Gradient();
          const color1 = "#FFC300";
          const color2 = "#C7003A";

          colorGradient.setMidpoint(this.info.length);
          colorGradient.setGradient(color1,  color2);
          this.colours = colorGradient.getArray();

          });


    },
    beforeUpdate(){
    },
    methods: {
      deleteTask: function(id){
        axios.delete(`http://localhost:3000/tasks/${id}`)
        .then(() => {

          this.info = this.info.filter((task) => {
            return task.id !== id
          });

        })
        .catch(function (error) {
          console.log(error);
        });
      },
      askToUpdateTask3: function(id){
        let taskToUpdate = this.info.filter(task => task.id == id)
        this.$emit('askToUpdateTask4', taskToUpdate)
      },
      convertRemind: function (task){
        if (task.reminder == 'false'){
          task.reminder = 'true'
        } else {
          task.reminder = 'false'
        }
      }
    }
}
</script>
