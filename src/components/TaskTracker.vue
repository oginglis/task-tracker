<template>
  <div class="task-tracker-wrap">
    <Modal
      @toggleOpenModal="toggleModal"
      :isOpen="isModalOpen"
      :task="taskInfo"
      :date="taskDate"
      :reminder="taskReminder"
      :id="taskId"
      @rerender="updateList"
      v-click-outside="onClickOutside"
      v-show="isModalOpen"
    >
    </Modal>
    <div class="text-inline">
      <Header title="Task Tracker" />
      <Button @changeButton="changeTheButton" :buttonText="submitButtonText" />
    </div>
    <transition name="fade">
      <TaskForm
        v-show="submitButtonText !== 'Add Task'"
        :taskInfoUpdate="taskInfo"
        :taskIdUpdate="taskId"
        :taskDateUpdate="taskDate"
        :taskReminderUpdate="taskReminder"
        :isUpdate="isPatch"
        @finishUpdate="finishedPatch"
      />
    </transition>
    <TaskList
      :updateWithThisTask="taskPassUpdate"
      @askToUpdateTask4="openFormWithTask"
    />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskForm from "./TaskForm.vue";
import TaskList from "./TaskList.vue";
import Modal from "./Modal.vue";
import vClickOutside from "v-click-outside";

export default {
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskForm,
    TaskList,
    Modal,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data: function () {
    return {
      submitButtonText: "Add Task",
      taskInfo: "",
      taskDate: "",
      taskReminder: false,
      taskId: null,
      taskColor: [],
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {},
    };
  },
  methods: {
    changeTheButton: function () {
      this.submitButtonText == "Add Task"
        ? (this.submitButtonText = "Hide Task Adder")
        : (this.submitButtonText = "Add Task");
      this.isPatch = false;
      (this.taskInfo = ""), (this.taskDate = ""), (this.taskReminder = false);
    },
    openFormWithTask: function (task) {
      if (this.isModalOpen == false) {
        this.isModalOpen = true;
        this.taskDate = task[0].date;
        this.taskReminder = task[0].reminder === "true";
        this.taskInfo = task[0].title;
        this.taskId = parseInt(task[0].id);
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
    updateList: function (task) {
      this.taskPassUpdate = task;
    },
    onClickOutside() {
      if (this.isModalOpen) {
        this.isModalOpen = false;
      }
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
