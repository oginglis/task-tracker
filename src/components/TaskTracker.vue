<template>
  <div class="task-tracker-wrap">
    <EditModal
      @toggleOpenModal="toggleModal"
      :isOpen="isModalOpen"
      :task="taskInfo"
      :date="taskDate"
      :reminder="taskReminder"
    >
    </EditModal>
    <div class="text-inline">
      <Header title="Task Tracker" />
      <Button @changeButton="changeTheButton" :buttonText="submitButtonText" />
    </div>
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
    <!-- <div>
      <Button :buttonText="`change order`"></Button>
    </div> -->
    <TaskList @askToUpdateTask4="openFormWithTask" />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskInput from "./TaskInput.vue";
import TaskList from "./TaskList.vue";
import EditModal from "./EditModal.vue";

export default {
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskInput,
    TaskList,
    EditModal,
  },
  data: function () {
    return {
      submitButtonText: "Add Task",
      taskInfo: "",
      taskDate: "",
      taskReminder: "",
      taskId: "",
      taskColor: [],
      isPatch: "false",
      isModalOpen: false,
      isInputOpen: false,
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
      if (this.isModalOpen == false) {
        this.isModalOpen = true;
        this.taskDate = task[0].date;
        this.taskReminder = task[0].reminder;
        this.taskInfo = task[0].title;
        this.taskId = task[0].id;
        this.taskColor = task[0].this.isPatch = "true";
      } else if (this.isModalOpen == true) {
        this.isModalOpen = false;
      }
    },
    finishedPatch: function () {
      this.isPatch = false;
    },
    toggleModal: function () {
      this.isModalOpen = !this.isModalOpen;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.task-tracker-wrap {
  padding: 0px 20px;
  border-radius: 10px;
  width: 500px;
  margin: 0px auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;
  border: 1px black solid;
}

.text-inline {
  display: flex;
  align-items: center;
  align-content: space-between;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
}
</style>
