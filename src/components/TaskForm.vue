<template>
  <div>
    <form ref="inputForm">
      <label for="title">Task</label>
      <input
        class="v-spacer task-box-input"
        type="text"
        name="title"
        id="title"
        placeholder="Add task"
        v-model="taskInfo"
      />
      <label class="v-spacer" for="date">Date & Time:</label>
      <input
        class="v-spacer"
        type="datetime-local"
        id="date"
        name="date"
        v-model="dateTime"
      />
      <label for="reminder">Set Reminder?</label>
      <input v-model="checked" type="checkbox" id="checkbox" />
      <button @click="submitForm" class="v-spacer">{{ updateOrSave }}</button>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "TaskForm",
  data: function () {
    return {
      checked: false,
      dateTime: Date,
      taskInfo: "",
    };
  },
  watch: {
    taskInfoUpdate: function () {
      // watch it

      this.taskInfo = this.taskInfoUpdate;
    },
    taskDateUpdate: function () {
      // watch it

      this.dateTime = this.taskDateUpdate;
    },
    taskReminderUpdate: function () {
      // watch it

      this.checked = this.taskReminderUpdate;
    },
  },
  props: {
    task: {
      title: {
        default: " This is a task to tesk",
        type: String,
      },
      date: {
        default: "20-July 101",
        type: String,
      },
      reminder: {
        default: false,
        type: Boolean,
      },
      id: {
        type: Number,
        default: null,
      },
    },
  },
  methods: {
    submitForm: function (e) {
      e.preventDefault();
      axios
        .post("http://localhost:3000/tasks", {
          title: this.taskInfo,
          date: this.dateTime,
          reminder: this.checked,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.taskInfoUpdate = "";
      this.taskDateUpdate = "";
      this.taskReminderUpdate = false;
      this.taskIdUpdate = "";
      this.finishUpdate;
    },
  },

  computed: {
    updateOrSave: function () {
      return this.isUpdate == true ? "Update Task" : "Save Task";
    },
  },
};
</script>

<style scoped>
#task-input {
  display: inline;
  width: 100%;
  align-self: end;
}
form {
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: flex-start;
  border: 1px black solid;
  margin: 0 auto;
  border-radius: 10px;
  width: 470px;
  background-color: linear-gradient("#FFC300", "#C7003A");
  background-size: cover;
}

.task-box-input {
  width: 80%;
  height: 50px;
  margin: 100px;
  align-self: end;
}
.v-spacer {
  margin: 5px 0px;
}

#checkbox {
  display: inline-block;
}
</style>
