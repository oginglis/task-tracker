<template>
  <div
    class="task-tracker-wrap"
    :style="[calculatedBackgroundColor, calculatedTextColor]"
  >
    <div v-if="showTasks" class="task_tracker_display" ref="taskDisplay">
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
        <Header
          :title="title"
          @updateTitle="updateTaskTrackerTitle"
          :headerColour="taskTrackerColour"
        />
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

      <p v-if="emptyMessage">You have no Tasks on this list yet.</p>
      <TaskList
        :updateWithThisTask="taskPassUpdate"
        @askToUpdateTask4="openFormWithTask"
        :listColour="taskTrackerColour"
        v-if="tasks"
        v-model:tasks="tasks"
        @askToDeleteTask="deleteTask"
        @sendUpTaskPositonAgain="0"
        @click="toggleModal"
        @sendTaskPositions="passTaskPositonsToModal"
      />
      <div class="task-tracker__bottom-bar">
        <Tooltip position="bottom" :tooltipText="'Choose list colour'">
          <ClickableIcon
            type="palette"
            class="hiding__icon"
            :bgColor="taskTrackerColour"
            :borderStyles="false"
            :style="iconBGHover"
            @iconClicked="toggleP5Canvas"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Create action'">
          <ClickableIcon
            type="plus"
            :bgColor="taskTrackerColour"
            @iconClicked="changeButton"
            class="add__action"
            :style="addIconBg()"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Delete list'">
          <ClickableIcon
            type="trash"
            :bgColor="taskTrackerColour"
            class="hiding__icon"
            :borderStyles="false"
            :style="iconBGHover"
          />
        </Tooltip>
      </div>
    </div>
    <P5Canvas
      v-else
      :canvasSize="taskTrackDimensions()"
      :bgColor="taskTrackerColour"
      :ballColours="colours"
      @clickColor="updateColor"
      :title="title"
      :textColor="calculatedTextColor"
    />
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
import Tooltip from "./Tooltip.vue";
import TaskService from "@/services/TaskService";
import { TaskType } from "@/types/Task";
import P5Canvas from "./P5CanvasColours.vue";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import { TrackerDimensions } from "@/types/Dimensions";
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
    Tooltip,
    ClickableIcon,
    P5Canvas,
  },
  created() {
    TaskService.getTasks().then((response): void => {
      this.tasks = response.data as Array<TaskType>;
      this.sortIndexes(this.tasks);
    });
  },
  data: function () {
    return {
      title: "Task Tracker",
      buttonText: "Add a Task",
      tasks: [] as Array<TaskType>,
      task: {} as TaskType,
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {} as TaskType,
      taskPositionsObjectParent: {} as TasksPositionObject,
      taskTrackerColour: "hsl(39, 81%, 73%)",
      showTasks: true,
      colours: [
        { colour: "hsl(39, 81%, 73%)", active: true },
        { colour: "hsl(13, 80%, 48%)", active: false },
        { colour: "hsl(341, 67%, 47%)", active: false },
        { colour: "hsl(75, 56%, 38%)", active: false },
        { colour: "hsl(10, 30%, 62%)", active: false },
        { colour: "hsl(0, 0%, 100%)", active: false },
        { colour: "hsl(319, 57%, 39%)", active: false },
        { colour: "hsl(2, 73%, 43%)", active: false },
        { colour: "hsl(207, 15%, 12%)", active: false },
        { colour: "hsl(196, 44%, 51%)", active: false },
        { colour: "hsl(12, 73%, 51%)", active: false },
        { colour: "hsl(164, 35%, 52%)", active: false },
        { colour: "hsl(31, 80%, 54%)", active: false },
        { colour: "hsl(205, 80%, 40%)", active: false },
        { colour: "hsl(41, 62%, 51%)", active: false },
        { colour: "hsl(186, 56%, 42%)", active: false },
        { colour: "hsl(195, 23%, 27%)", active: false },
        { colour: "hsl(316, 38%, 58%)", active: false },
        { colour: "hsl(207, 15%, 12%)", active: false },
        { colour: "hsl(212, 73%, 36%)", active: false },
      ],
    };
  },
  methods: {
    addIconBg: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.taskTrackerColour!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
    },
    updateTaskTrackerTitle: function (newTitle: string): void {
      console.log("Update the title");
      this.title = newTitle;
    },
    updateColor: function (newColor: string): void {
      let hslNewColor = tinyColor(newColor).toHslString();
      this.taskTrackerColour = hslNewColor;
      this.toggleP5Canvas();
    },
    toggleP5Canvas: function (): void {
      console.log("Toggle Canvas CAleed");
      this.showTasks ? (this.showTasks = false) : (this.showTasks = true);
      this.taskTrackDimensions();
    },
    taskTrackDimensions: function (): TrackerDimensions {
      let taskDisplay = this.$refs["taskDisplay"] as any;
      if (taskDisplay) {
        let cs = getComputedStyle(taskDisplay);

        let paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        let borderY =
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        // Element width and height minus padding and border

        let elementHeight = taskDisplay.offsetHeight - paddingY - borderY;
        if (elementHeight < 450) {
          elementHeight = 450;
        }
        return { height: elementHeight, width: this.$el.offsetWidth };
      }
      return { height: 100, width: 2000 };
    },
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
    iconBGHover: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.taskTrackerColour!)!.slice(1, 4);
      return {
        "--bg-hov-color": `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
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

.task-tracker-wrap:hover .hiding__icon {
  visibility: visible;
  opacity: 1;
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

.icon__bottoms {
  font-size: 2rem;
}

.hiding__icon {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hiding__icon:hover {
  background-color: var(--bg-hov-color);
}
.add__action {
  padding: 1rem 2.5rem;
  border-radius: 0.8rem;
}

.add__action.icon:hover {
  transform: scale(1.1);
}
</style>
