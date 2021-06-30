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
        v-if="buttonText !== 'Add Task'"
        :task="task"
        :isUpdate="isPatch"
        @finishUpdate="finishedPatch"
        :taskCount="totalTaskCount"
        @newTaskCreated="addNewTaskToTasks"
      />
    </transition>
    <TaskList
      :updateWithThisTask="taskPassUpdate"
      @askToUpdateTask4="openFormWithTask"
      v-if="tasks"
      :tasks.sync="tasks"
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
import TaskService from "@/services/TaskService.js";

export default {
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskForm,
    TaskList,
    Modal,
  },
  created() {
    TaskService.getTasks().then((response) => {
      this.tasks = response.data;
      this.sortIndexes(this.tasks);
    });
  },
  data: function () {
    return {
      buttonText: "Add Task",
      tasks: null,
      task: {
        title: null,
        date: null,
        id: null,
        reminder: null,
      },
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {},
    };
  },
  methods: {
    addNewTaskToTasks: function (task) {
      this.tasks.push(task);
      this.buttonText = "Add Task";
    },
    sortIndexes: function (elems) {
      elems.sort(function (a, b) {
        return a.position - b.position;
      });
    },
    clickOutsideHandler: function () {
      if (this.isModalOpen) {
        this.onClickOutside();
      }
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
        this.task.reminder = task[0].reminder;
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
      TaskService.deleteTask(id)
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
      var length;
      if (this.tasks) {
        length = this.tasks.length;
      }
      return length;
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
