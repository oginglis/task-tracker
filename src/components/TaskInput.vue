<template>
    <div>
      <form ref="inputForm" >
        <input class="v-spacer task-box-input" type="text" name="title" id="title" placeholder="Write the task here" v-model="taskInfo">
        <label class="v-spacer" for="date">Birthday (date and time):</label>
        <input class="v-spacer" type="datetime-local" id="date" name="date" v-model="dateTime">
        <label for="reminder">Set Reminder?</label>
        <input v-model="checked" type="checkbox" id="checkbox">
        <button @click="submitForm" class="v-spacer" >{{updateOrSave}}</button>
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
    watch: {
      taskInfoUpdate: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal);
        this.taskInfo = this.taskInfoUpdate;
      },
      taskDateUpdate: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal);
        this.dateTime = this.taskDateUpdate;
      },
      taskReminderUpdate: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal);
        this.checked = this.taskReminderUpdate;
      },
    },
    props: {
      taskInfoUpdate: String,
      taskDateUpdate: String,
      taskReminderUpdate: Boolean,
      taskIdUpdate: String,
      isUpdate: {
        default: 'false',
        type: String
      }
    },
    methods: {
      submitForm: function(){
        if(this.isUpdate == 'false'){
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
        } else if (this.isUpdate == 'true') {
          axios.patch(`http://localhost:3000/tasks/${this.taskIdUpdate}`, {
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
          this.taskInfoUpdate= ""
          this.taskDateUpdate= ""
          this.taskReminderUpdate= ""
          this.taskIdUpdate= ""
          this.finishUpdate;
        }
      },
      finishUpdate: function(){
        this.$emit('finishUpdate')
      }
    },
    computed: {
      updateOrSave: function() {
        return this.isUpdate == 'true' ? "Update Task" : "Save Task"
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
  padding: 10px;
  align-items: center;
  background-color: #ffc72a;
  margin: 0 auto;
  border-radius: 25px;
  width: 470px;
}

.task-box-input{
  width: 80%;
  height: 50px;
  margin: 100px;

}
.v-spacer{
    margin: 5px;
}
</style>
