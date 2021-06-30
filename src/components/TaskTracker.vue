<template>
  <div class="task-tracker-wrap">
    <Modal
      @toggleOpenModal="toggleModal"
      @rerender="updateList"
      :isOpen="isModalOpen"
      :task="task"
      @clickOutside="onClickOutside"
      v-if="isModalOpen"
    >
    </Modal>
    <div class="text-inline">
      <Header title="Task Tracker" />
      <Button @clickButton="changeButton" :buttonText="buttonText" />
    </div>
    <transition name="fade">
      <TaskForm
        v-show="buttonText !== 'Add Task'"
        :task="task"
        :isUpdate="isPatch"
        @finishUpdate="finishedPatch"
        :taskCount="totalTaskCount"
      />
    </transition>
    <TaskList
      :updateWithThisTask="taskPassUpdate"
      @askToUpdateTask4="openFormWithTask"
      :tasks="tasks"
      @askToDeleteTask="deleteTask"
    />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskForm from "./TaskForm.vue";
import TaskList from "./TaskList.vue";
import Modal from "./Modal.vue";
import axios from "axios";
import Gradient from "javascript-color-gradient";

export default {
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskForm,
    TaskList,
    Modal,
  },
  async created() {
    await this.fetchData();
    let colorGradient = new Gradient();
    const color1 = "#FFC300";
    const color2 = "#C7003A";
    colorGradient.setMidpoint(this.info.length * 2);
    colorGradient.setGradient(color1, color2);
    this.colours = colorGradient.getArray();
  },
  data: function () {
    return {
      buttonText: "Add Task",
      tasks: [],
      task: {
        title: null,
        date: null,
        id: null,
        reminder: null,
      },
      taskColor: [],
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {},
      colours: [],
    };
  },
  methods: {
    clickOutsideHandler: function () {
      if (this.isModalOpen) {
        this.onClickOutside();
      }
    },
    fetchData: function () {
      return axios.get("http://localhost:3000/tasks").then((response) => {
        console.log("created called");
        this.tasks = response.data;
      });
    },
    changeButton: function () {
      this.buttonText == "Add Task"
        ? (this.buttonText = "Hide Task Adder")
        : (this.buttonText = "Add Task");
      this.isPatch = false;
      (this.task.title = ""),
        (this.task.date = ""),
        (this.task.reminder = false);
    },
    openFormWithTask: function (task) {
      if (this.isModalOpen == false) {
        this.isModalOpen = true;
        this.task.date = task[0].date;
        this.task.reminder = task[0].reminder === "true";
        this.task.title = task[0].title;
        this.task.id = parseInt(task[0].id);
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
        console.log("Clicked outside");
        this.isModalOpen = false;
      }
    },
    deleteTask: function (id) {
      axios
        .delete(`http://localhost:3000/tasks/${id}`)
        .then(() => {
          this.tasks = this.tasks.filter((task) => {
            return task.id !== id;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {
    totalTaskCount: function () {
      return this.tasks.length;
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
