<template>
  <div
    class="task-tracker-wrap"
    ref="taskTrackerInstance"
    :style="[calculatedBackgroundColor, calculatedTextColor]"
    :class="{ add__padding: showTasks, remove_padding: !showTasks }"
  >
    <div v-if="showTasks" class="task_tracker_display" ref="taskDisplay">
      <Modal
        @toggleOpenModal="toggleModal"
        xs
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
      <div>
        <div class="text-inline">
          <ListHeader
            :title="title"
            @updateTitle="updateTaskTrackerTitle"
            :headerColour="taskTrackerColour"
            :startFocused="false"
          />
        </div>
        <TodoList
          :updateWithThisTask="taskPassUpdate"
          @askToUpdateTask4="openFormWithTask"
          :listColour="taskTrackerColour"
          v-if="tasks"
          v-model:tasks="tasks"
          @askToDeleteTask="deleteTask"
          @sendUpTaskPositonAgain="0"
          @sendTaskPositions="passTaskPositonsToModal"
          :showActionAdder="showAddTask"
          @clickedOutsideActionAdder="toggleActionAdder"
          @addTempActionToList="addActiontoList"
          @adderLeft="recordHeight"
          @removedActions="recordHeight"
        />
      </div>
      <p v-if="emptyMessage">You have no Actions on <br />this list yet.</p>

      <div class="task-tracker__bottom-bar">
        <Tooltip position="bottom" :tooltipText="'Choose list colour'">
          <Icon
            type="palette"
            class="hiding__icon"
            :bgColor="taskTrackerColour"
            :borderStyles="false"
            :style="iconBGHover"
            @iconClicked="toggleP5Canvas"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Create action'">
          <Icon
            type="plus"
            :bgColor="taskTrackerColour"
            @iconClicked="toggleActionAdder"
            class="add__action"
            :style="addIconBg()"
            v-if="!showAddTask"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Delete list'">
          <Icon
            type="trash"
            :bgColor="taskTrackerColour"
            class="hiding__icon"
            :borderStyles="false"
            :style="iconBGHover"
            @click="deleteList"
          />
        </Tooltip>
      </div>
    </div>
    <ColourSelector
      v-else
      :canvasSize="taskTrackDimensions()"
      :bgColor="taskTrackerColour"
      :ballColours="colours"
      @clickColor="updateColor"
      :title="p5Message"
      :textColor="calculatedTextColor"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ListHeader from "./ListHeader.vue";
import TodoList from "./TodoList.vue";
import Icon from "../common/components/Icon.vue";
import Modal from "../common/components/Modal.vue";
import Tooltip from "../common/components/Tooltip.vue";
import TaskService from "@/services/TaskService";
import ListService from "@/services/ListService";
import { TodoType } from "@/types/Todo";
import ColourSelector from "./ColourSelector.vue";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import { TrackerDimensions } from "@/types/Dimensions";
import _ from "lodash";
import tinyColor from "tinycolor2";

export default defineComponent({
  name: "List",
  components: {
    ListHeader,
    TodoList,
    Modal,
    Tooltip,
    Icon,
    ColourSelector,
  },
  created() {
    this.getAllTodos();
  },
  mounted() {
    let trackerInstance: HTMLElement | null = this.$refs
      .taskTrackerInstance as HTMLElement;
    let trackerSize = trackerInstance!.getBoundingClientRect();

    this.width = Math.trunc(trackerSize.width);
    this.height = Math.trunc(trackerSize.height);
    // initialize the observer on mount
    this.initObserver();
  },
  updated() {
    this.$nextTick(() => {

      this.recordHeight();
    });
  },
  props: ["trackerTitle", "trackerColor", "taskTrackerID"],
  watch: {
    tasks: {
      deep: true,
      handler: function (): void {
        this.recordHeight();
      },
    },
  },

  data: function () {
    return {
      trackerID: this.taskTrackerID,
      title: this.trackerTitle,
      buttonText: "Add a Task",
      tasks: [] as Array<TodoType>,
      task: {} as TodoType,
      isPatch: false,
      isModalOpen: false,
      isInputOpen: false,
      taskPassUpdate: {} as TodoType,
      taskPositionsObjectParent: {} as TasksPositionObject,
      taskTrackerColour: this.trackerColor,
      width: 0,
      height: 0,
      observer: null as unknown,
      showTasks: true,
      showAddTask: false,
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
    deleteList: function():void{
      this.$emit("requestDeleteList",this.trackerID )
    },
    initObserver() {
      const tracker: HTMLElement | null = this.$refs.taskTrackerInstance as HTMLElement,
        vm = this,
        config = {
          attributes: true,
        };
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === "attributes") {
            let { width, height } = tracker!.style;
            vm.width = parseInt(width, 10);
            vm.height = parseInt(height, 10);
            vm.recordHeight();
          }
        });
      });
      observer.observe(tracker as Node, config);
      this.observer = observer;
    },
    recordHeight: function (): void {
      this.$nextTick(() => {
        if (this.$refs.taskTrackerInstance != null) {
          let trackerInstance: HTMLElement  = this.$refs
            .taskTrackerInstance as HTMLElement;
          this.width = trackerInstance!.clientWidth;
          this.height = trackerInstance!.clientHeight;
          this.saveList();
        }
        this.$emit("sizingUpdate", this.height);
      });
    },
    getAllTodos: function (): void {
      TaskService.getTasks().then((response): void => {
        this.tasks = response.data as Array<TodoType>;
        this.sortIndexes(this.tasks);
      }).catch(function (error) {
          console.log(error);
        });
    },
    saveList: function (): void {
      ListService.patchList(this.trackerID, {
        title: this.title,
        width: this.width,
        height: this.height,
        backgroundColour: this.taskTrackerColour,
        id: this.taskTrackerID,
      }).catch(function (error) {
          console.log(error);
        });
    },
    addActiontoList: function (newAction: TodoType): void {
      this.addNewTaskToTasks(newAction);
      this.recordHeight();
    },
    toggleActionAdder: function () {
      this.showAddTask = !this.showAddTask;
    },
    addIconBg: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.taskTrackerColour!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
    },
    updateTaskTrackerTitle: function (newTitle: string): void {
      this.title = newTitle;
      this.saveList();
    },
    updateColor: function (newColor: string): void {
      let hslNewColor = tinyColor(newColor).toHslString();
      this.taskTrackerColour = hslNewColor;
      this.saveList();
      this.toggleP5Canvas();
      this.taskTrackDimensions();
    },
    getAbsoluteHeight: function (el: Element | null ) {
      el = typeof el === "string" ? document.querySelector(el): el;
      var styles = window.getComputedStyle(el as Element);
      var padding =
        parseFloat(styles["paddingTop"]) + parseFloat(styles["paddingBottom"]);
      padding;
      return Math.ceil((el as HTMLElement).offsetHeight);
    },
    toggleP5Canvas: function (): void {
      this.taskTrackDimensions();
      this.showTasks = !this.showTasks;
    },
    taskTrackDimensions: function (): TrackerDimensions {
      let taskDisplay = this.$refs["taskTrackerInstance"] as HTMLElement;
      console.log("Task Displayt", taskDisplay)
      if (taskDisplay) {
        let elementHeight = this.getAbsoluteHeight(taskDisplay);
        if (elementHeight < 450) {
          elementHeight = 450;
        }
        return { height: elementHeight, width: this.$el.offsetWidth };
      }
      return { height: 100, width: 2000 };
    },
    updateTaskReminder: function (task: TodoType) {
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
    addNewTaskToTasks: function (task: TodoType): void {
      this.tasks.push(task);
      this.buttonText = "Add a Task";
      this.updatePositionsWithIndexes();
      this.recordHeight();
    },
    sortIndexes: function (elems: TodoType[]) {
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
    openFormWithTask: function () {
      if (this.isModalOpen == false) {
        // this.isModalOpen = true;
        // this.task.date = task[0].date;
        // this.task.reminder = task[0].reminder;
        // this.task.title = task[0].title;
        // this.task.completed = task[0].completed;
        // this.task.id = parseInt(task[0].id);
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
    updateList: function (task: TodoType): void {
      this.taskPassUpdate = task;
      this.tasks;
      let indexOld: number = _.keys(_.pickBy(this.tasks, { id: task.id }));
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
        this.tasks = this.tasks.filter((task) => {
          return task.id !== id;
        });
      TaskService.deleteTask(id)
        .then(() => {
          this.recordHeight();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },

  computed: {
    p5Message: function (): string {
      return "Choose a colour for " + this.title;
    },
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
      if (this.showAddTask) {
        return {
          "--bg-hov-color": `hsl(${hsl[0]},${hsl[1]}%,${
            parseInt(hsl[2]) + 10
          }%`,
          visibility: "visible",
          opacity: "1",
        };
      } else {
        return {
          "--bg-hov-color": `hsl(${hsl[0]},${hsl[1]}%,${
            parseInt(hsl[2]) + 10
          }%`,
        };
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
  border-radius: 1rem;
  width: 300px;
  margin: 0 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;
  min-height: 33rem;
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
  margin-top: 0.5rem;
  height: 4rem;
}

.icon__bottoms {
  font-size: 2rem;
}

.hiding__icon {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.1s ease;
}

.hiding__icon:hover {
  background-color: var(--bg-hov-color);
}
.add__action {
  padding: 1rem 2.5rem;
  border-radius: 0.8rem;
}

.task_tracker_display {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.add__action.icon:hover {
  transform: scale(1.1);
}

.add__padding {
  padding-top: 24px;
  padding-bottom: 24px;
}

.remove_padding {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
