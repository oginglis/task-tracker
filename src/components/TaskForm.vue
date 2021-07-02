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
        v-model="task.title"
      />
      <label class="v-spacer" for="date">Date & Time:</label>
      <input
        class="v-spacer"
        type="datetime-local"
        id="date"
        name="date"
        v-model="task.date"
      />
      <label for="reminder">Set Reminder?</label>
      <input v-model="task.date" type="checkbox" id="checkbox" />
      <button @click="submitForm" class="v-spacer">Save Task</button>
    </form>
  </div>
</template>
<script lang="ts">
import TaskService from "@/services/TaskService.js";
import { defineComponent } from "vue";
import { TaskType } from "@/types/Task";
export default defineComponent({
  name: "TaskForm",
  data: function () {
    return {
      task: {} as TaskType,
    };
  },
  watch: {},
  props: {
    taskCount: Number,
  },
  methods: {
    submitForm: function (e: Event) {
      e.preventDefault();

      TaskService.postTask(this.task)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.$emit("newTaskCreated", this.task);
    },
  },
});
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
