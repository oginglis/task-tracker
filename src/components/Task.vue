<template>
    <div class="task-wrapper" :style="style" :class="{reminder: isTrueSet}">
        <h1>{{title}}</h1>
        <h2>{{momentDate}}</h2>
        <font-awesome-icon @click="askToUpdateTask(id)" class="fa-spacer" icon="edit"></font-awesome-icon>
        <font-awesome-icon @click="askToDeleteTask(id)" class="fa-spacer" icon="times-circle"></font-awesome-icon>
    </div>
</template>

<script>
// this is must have
import { library } from '@fortawesome/fontawesome-svg-core';
// import { name of your icon in camelCase } from "@fortawesome/free-solid-svg-icons";
// For example, I want to use fa-enveloper-open-text, then it's faEnvelopeOpenText
import { faTimesCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
// Then add it to library
library.add([faTimesCircle, faEdit])
import moment from 'moment'

export default {
    name: "Task",
    components: {

    },
    data(){
        return {

        }
    },
    props: {
        title: String,
        date: String,
        id: Number,
        reminder: {
          type: Boolean,
          default: false
        },
        taskColor: String
    },
    computed: {
      isTrueSet: function(){
        if(this.reminder == true ){
          return true
        } else {
          return false
        }
      },
      style: function() {
        return 'background-color: ' + this.taskColor ;
      },
      momentDate: function(){
        return moment(this.date).format("MMM Do YYYY")
      },
    },
    methods: {
      askToDeleteTask: function(id){
        this.$emit('askToDeleteTask2', id)

      },
      askToUpdateTask: function(id){
        this.$emit('askToUpdateTask2', id)
      }
    }


}
</script>

<style scoped>

.task-wrapper{
  width: 500px;
  margin: 0 auto;
}
.reminder{
  border-left: 10px solid green ;
}

.fa-spacer {
  margin-left: 15px;

}
.fa-spacer:hover {
  color: green;
  cursor: pointer;

}
</style>
