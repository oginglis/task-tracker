<template>
  <div class="task-tracker-wrap">
    <Header title="Task Tracker" />
    <Button @changeButton="changeTheButton" :buttonText="submitButtonText" />
    <transition name="fade">
      <TaskInput
        v-show="submitButtonText !== 'Add Task'"
        :taskInfoUpdate="taskInfo"
        :taskIdUpdate="taskId"
        :taskDateUpdate="taskDate"
        :taskReminderUpdate="taskReminder"
        :isUpdate="isPatch"
        @finishUpdate="finishedPatch"
      />
    </transition>
    <div>
      <Button :buttonText="`change order`"></Button>
    </div>
    <TaskList @askToUpdateTask4="openFormWithTask" />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskInput from "./TaskInput.vue";
import TaskList from "./TaskList.vue";

export default {
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskInput,
    TaskList,
  },
  data: function () {
    return {
      submitButtonText: "Add Task",
      taskInfo: "",
      taskDate: "",
      taskReminder: "",
      taskId: "",
      isPatch: "false",
    };
  },
  methods: {
    changeTheButton: function () {
      this.submitButtonText == "Add Task"
        ? (this.submitButtonText = "Hide Task Adder")
        : (this.submitButtonText = "Add Task");
      this.isPatch = "false";
      (this.taskInfo = ""), (this.taskDate = ""), (this.taskReminder = "");
    },
    openFormWithTask: function (task) {
      if (this.submitButtonText == "Add Task") {
        this.submitButtonText = "Hide Task Adder";
        this.taskDate = task[0].date;
        this.taskReminder = task[0].reminder;
        this.taskInfo = task[0].title;
        this.taskId = task[0].id;
        this.isPatch = "true";
        var element = this.$refs["inputForm"];
        var top = element.offsetTop;
        window.scrollTo(0, top);
      } else if (this.submitButtonText == "Hide Task Adder") {
        this.submitButtonText = "Add Task";
      }
    },
    finishedPatch: function () {
      this.isPatch = false;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.task-tracker-wrap {
  background-color: rgb(255, 228, 179);
  padding: 20px;
  width: 700px;
  margin: 0px auto;
  border-radius: 25px;
  box-sizing: border-box;
}
</style>
