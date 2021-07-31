<template>
  <div
    class="task-tracker-wrap"
    :style="[calculatedBackgroundColor, calculatedTextColor]"
  >
    <Modal
      @toggleOpenModal="toggleModal"
      @rerender="updateList"
      :isOpen="isModalOpen"
      :task="task"
      @clickOutside="onClickOutside"
      v-if="isModalOpen"
      :taskPosition="calculateTaskPosition(task.id)"
      :modalColour="taskTrackerColour"
      @toggleReminder="updateTaskReminder"
    >
    </Modal>
    <div class="text-inline">
      <Header title="Task Tracker" />
      <Button
        @clickButton="changeButton"
        :buttonText="buttonText"
        :buttonBGColor="taskTrackerColour"
        :style="calculatedTextColor"
      />
    </div>

    <transition name="fade">
      <TaskForm
        v-if="buttonText !== 'Add a Task'"
        :task="task"
        :isUpdate="isPatch"
        @finishUpdate="finishedPatch"
        :taskCount="totalTaskCount"
        @newTaskCreated="addNewTaskToTasks"
        :formColour="taskTrackerColour"
      />
    </transition>
    <ColourSelector @changeColour="changeTaskTrackerColour" />
    <p v-if="emptyMessage">You have no Tasks on this list yet.</p>
    <TaskList
      :updateWithThisTask="taskPassUpdate"
      @askToUpdateTask4="openFormWithTask"
      :listColour="taskTrackerColour"
      v-if="tasks"
      v-model:tasks="tasks"
      @askToDeleteTask="deleteTask"
      @sendUpTaskPositonAgain="0"
      @sendTaskPositions="passTaskPositonsToModal"
    />
    <div class="task-tracker__bottom-bar">
      <ClickableIcon type="palette" :bgColor="taskTrackerColour" />
      <ClickableIcon type="plus" :bgColor="taskTrackerColour" />
      <ClickableIcon type="trash" :bgColor="taskTrackerColour" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Header.vue";
import Button from "./Button.vue";
import TaskForm from "./TaskForm.vue";
import TaskList from "./TaskList.vue";
import ClickableIcon from "./ClickableIcon.vue";
import Modal from "./Modal.vue";
import ColourSelector from "./ColourSelector.vue";
import TaskService from "@/services/TaskService";
import { TaskType } from "@/types/Task";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import _ from "lodash";
import tinyColor from "tinycolor2";

export default defineComponent({
  name: "TaskTracker",
  components: {
    Header,
    Button,
    TaskForm,
    TaskList,
    Modal,
    ColourSelector,
    ClickableIcon,
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
      taskTrackerColour: "hsl(39, 81%, 73%)",
    };
  },
  methods: {
    updateTaskReminder: function (task: TaskType) {
      this.task.reminder = !this.task.reminder;
      TaskService.patchTask(task.id, this.task).catch(function (error) {
        console.log(error);
      });
    },
    changeTaskTrackerColour: function (colour: string): void {
      this.taskTrackerColour = colour;
    },
    calculateTaskPosition: function (id: number): TaskPosition {
      return this.taskPositionsObjectParent[id];
    },
    passTaskPositonsToModal: function (taskPositons: TasksPositionObject) {
      this.taskPositionsObjectParent = taskPositons;
    },
    addNewTaskToTasks: function (task: TaskType): void {
      this.tasks.push(task);
      this.buttonText = "Add a Task";
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
        this.task.completed = task[0].completed;
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
    emptyMessage: function (): Boolean {
      if (this.tasks.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    totalTaskCount: function (): number {
      var length: number = 0;
      if (this.tasks) {
        length = this.tasks.length;
      }
      return length;
    },
    calculatedBackgroundColor: function (): object {
      return {
        backgroundColor: this.taskTrackerColour,
      };
    },
    calculatedTextColor: function (): object {
      if (tinyColor(this.taskTrackerColour).isLight()) {
        return {
          color: "black",
        };
      } else {
        return {
          color: "white",
        };
      }
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
  padding: 1.5rem 3rem;
  border-radius: 10px;
  width: 300px;
  margin: 0px auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;

  min-height: 30rem;
}

.text-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-between;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
}

.task-tracker__bottom-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 1.5rem;
  font-weight: 0.5rem;
}
</style>
