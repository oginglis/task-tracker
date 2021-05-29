<template>
    <div>
        <Task v-for="(task, index) in info" :title="task.title" :date="task.date" :reminder="toBool(task.reminder)" :key="task.id" :id="task.id" v-on:askToDeleteTask2="deleteTask" :taskColor="colours[index]"/>
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
          const color1 = "#3F2CAF";
          const color2 = "#8BC2E3";

          colorGradient.setMidpoint(this.info.length);
          colorGradient.setGradient(color1, color2);
          this.colours = colorGradient.getArray();
          console.log(this.colours)
          });


    },
    beforeUpdate(){
      console.log("Data has about to change")
    },
    methods: {
      deleteTask: function(id){
        console.log("yeah boiii")
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
      toBool: function(bool){
        bool == "true" || bool == true ? true : false
      }
    }
}
</script>
