<template>
    <div>
        <form  >
            <input class="v-spacer" type="text" name="title" id="title" placeholder="Write the task here" v-model="taskInfo">
            <label class="v-spacer" for="date">Birthday (date and time):</label>
            <input class="v-spacer" type="datetime-local" id="date" name="date" v-model="dateTime">
            <label for="reminder">Set Reminder?</label>
            <input v-model="checked" type="checkbox" id="checkbox">
            <button @click="submitForm" class="v-spacer" >Save Task</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: "TaskInput",
    data: function(){
        return {
            checked: false,
            dateTime: Date,
            taskInfo: ""
        }
    },
    methods: {
      submitForm: function(){
        axios.post('http://localhost:3000/tasks', {
          title: this.taskInfo,
          date: this.dateTime,
          reminder: this.checked
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }

}
</script>

<style scoped>
#task-input{
    display: inline;
    width: 100%;
}
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
    align-items: center;
    background-color: lightblue;
    margin: 0 auto;
}

.v-spacer{
    margin: 5px;
}
</style>
