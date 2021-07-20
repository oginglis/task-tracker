<template>
  <div class="task-tracker-wrap">
    <Modal
      @toggleOpenModal="toggleModal"
      @rerender="updateList"
      :isOpen="isModalOpen"
      :task="task"
      @clickOutside="onClickOutside"
      v-if="isModalOpen"
      :taskPosition="calculateTaskPosition(task.id)"
    >
    </Modal>
    <div class="text-inline">
      <Header title="Task Tracker" />
      <Button @clickButton="changeButton" :buttonText="buttonText" />
    </div>
    <transition name="fade">
      <TaskForm
        v-if="buttonText !== 'Add a Task'"
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
      v-model:tasks="tasks"
      @askToDeleteTask="deleteTask"
      @sendUpTaskPositonAgain="0"
      @sendTaskPositions="passTaskPositonsToModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskForm from "./TaskForm.vue";
import TaskList from "./TaskList.vue";
import Modal from "./Modal.vue";
import TaskService from "@/services/TaskService";
import { TaskType } from "@/types/Task";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import _ from "lodash";

export default defineComponent({
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskForm,
    TaskList,
    Modal,
  },
  created() {
    TaskService.getTasks().then((response): void => {
      this.tasks = response.data as Array<TaskType>;
      this.sortIndexes(this.tasks);
    });
  },
  data: function () {
    return {
      buttonText: "Add a Task",
      tasks: [] as Array<TaskType>,
      task: {} as TaskType,
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {} as TaskType,
      taskPositionsObjectParent: {} as TasksPositionObject,
    };
  },
  methods: {
    calculateTaskPosition: function (id: number): TaskPosition {
      return this.taskPositionsObjectParent[id];
    },
    passTaskPositonsToModal: function (taskPositons: TasksPositionObject) {
      this.taskPositionsObjectParent = taskPositons;
    },
    addNewTaskToTasks: function (task: TaskType): void {
      this.tasks.push(task);
      this.buttonText = "Add Task";
      this.updatePositionsWithIndexes();
    },
    sortIndexes: function (elems: TaskType[]) {
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
      this.buttonText == "Add a Task"
        ? (this.buttonText = "Hide Task Adder")
        : (this.buttonText = "Add a Task");
      this.isPatch = false;
      (this.task.title = ""),
        (this.task.date = ""),
        (this.task.reminder = false);
    },
    openFormWithTask: function (task: any) {
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
    finishedPatch: function (): void {
      this.isPatch = false;
    },
    toggleModal: function () {
      this.isModalOpen = !this.isModalOpen;
    },
    updateList: function (task: TaskType): void {
      this.taskPassUpdate = task;
      this.tasks;
      let indexOld: number = _.keys(_.pickBy(this.tasks, { id: task.id }));
      // Find matching task index, then splice replace
      this.tasks.splice(indexOld, 1, task);
    },
    onClickOutside() {
      if (this.isModalOpen) {
        console.log("Clicked outside");
        this.isModalOpen = false;
      }
    },
    updatePositionsWithIndexes() {
      this.tasks.forEach((task, index) => {
        task.position = index;
      });
    },
    deleteTask: function (id: number) {
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
    totalTaskCount: function (): number {
      var length: number = 0;
      if (this.tasks) {
        length = this.tasks.length;
      }
      return length;
    },
  },
});
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
