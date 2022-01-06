<template>
  <li
    class="task-tracker-wrap"
    ref="taskTrackerInstance"
    :style="[calculatedBackgroundColor, calculatedTextColor]"
    :class="{ add__padding: showTasks, remove_padding: !showTasks }"
  >
    <div v-if="showTasks" class="task_tracker_display" ref="taskDisplay">
      <div>
        <div class="text-inline">
          <ListHeader
            :title="localList.title"
            @updateTitle="updateTaskTrackerTitle"
            :headerColour="localList.backgroundColour"
            :startFocused="false"
          />
        </div>
        <TodoList
          v-if="localTasks"
          v-model:localTasks="localTasks"
          @dragBegin="darkenBackground"
          @dragEnd="lightenBackground"
          @askToDeleteTask="deleteTask"
          @sendUpTaskPositonAgain="0"
          @sendTaskPositions="passTaskPositonsToModal"
          @clickedOutsideActionAdder="toggleActionAdder"
          @addTempActionToList="addActiontoList"
          @adderLeft="recordHeight"
          @removedActions="recordHeight"
          :listColour="localList.backgroundColour"
          :updateWithThisTask="taskPassUpdate"
          :showActionAdder="showAddTask"
          :list_id="localList.id"
        />
      </div>
      <p v-if="showEmptyMessage" class="message_animations">You have no Actions on <br />this list yet.</p>

      <div class="task-tracker__bottom-bar">
        <Tooltip position="bottom" :tooltipText="'Delete list'">
          <Icon
            type="trash"
            :bgColor="this.localList.backgroundColour"
            class="hiding__icon"
            :borderStyles="false"
            :style="[iconBGHover, addIconBg()]"
            @click="deleteList"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Create action'">
          <Icon
            type="plus"
            :bgColor="localList.backgroundColour"
            @iconClicked="toggleActionAdder"
            class="add__action"
            :style="addIconBg()"
            v-if="!showAddTask"
          />
        </Tooltip>
        <Tooltip position="bottom" :tooltipText="'Choose list colour'">
          <Icon
            type="palette"
            class="hiding__icon brighter"
            :bgColor="localList.backgroundColour"
            :borderStyles="false"
            :style="[iconBGHover, addIconBg()]"
            @iconClicked="toggleP5Canvas"
          />
        </Tooltip>
      </div>
    </div>
    <ColourSelector
      v-else
      :canvasSize="taskTrackDimensions()"
      :bgColor="localList.backgroundColour"
      @clickColor="updateColor"
      :title="p5Message"
      :textColor="calculatedTextColor"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ListHeader from "./ListHeader.vue";
import TodoList from "./TodoList.vue";
import Icon from "../common/components/Icon.vue";
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
import { ListType } from "@/types/List";

export default defineComponent({
  name: "List",
  components: {
    ListHeader,
    TodoList,
    Tooltip,
    Icon,
    ColourSelector,
  },
  beforeMount(){
this.localList = this.list;
  },

  mounted() {
    this.localTasks = this.tasks;
    this.localList = this.list;
    let trackerInstance: HTMLElement | null = this.$refs.taskTrackerInstance as HTMLElement;
    let trackerSize = trackerInstance!.getBoundingClientRect();
    this.localList.width = Math.trunc(trackerSize.width);
    this.localList.height = Math.trunc(trackerSize.height);
    this.initObserver();
  },
  updated() {
    this.$nextTick(() => {

      this.recordHeight();
    });
  },
  props: {
    list: {
      type: Object as PropType<ListType>,
      default: () => { return {
      "backgroundColour": "hsl(2, 73%, 43%)",
      "width": 340,
      "height": 576,
      "title": "Things to do",
      "id": 1}}
    },
    tasks: {type: Array as PropType<Array<TodoType>>,default: ()=>[  {
      "listId": 2,
      "title": "Task list order not persisting",
      "id": 59.40124494950645,
      "position": 1
    },]}
  },
  watch: {
    localTasks: {
      deep: true,
      handler: function (): void {
        this.recordHeight(); 
      },
    },
  },

  data: function () {
    return {
      localList: {} as ListType,
      buttonText: "Add a Task",
      localTasks: [] as Array<TodoType>,
      task: {} as TodoType,
      isPatch: false,
      taskPassUpdate: {} as TodoType,
      taskPositionsObjectParent: {} as TasksPositionObject,
      observer: null as unknown,
      showTasks: true,
      showAddTask: false
    };
  },
  methods: {
    darkenBackground: function(): void {
    let trackerInstance: HTMLElement | null = this.$refs
      .taskTrackerInstance as HTMLElement;
      trackerInstance.style.filter =  "brightness(95%)";
    },
      lightenBackground: function(): void {
    let trackerInstance: HTMLElement | null = this.$refs
      .taskTrackerInstance as HTMLElement;
      trackerInstance.style.filter =  "brightness(100%)";
    },
    deleteList: function():void{
      this.$emit("requestDeleteList",this.localList.id )
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
            vm.localList.width = parseInt(width, 10);
            vm.localList.height = parseInt(height, 10);
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
          this.localList.width = trackerInstance!.clientWidth;
          this.localList.height = trackerInstance!.clientHeight;
          this.saveList();
        }
        this.$emit("sizingUpdate", this.localList.height);
      });
    },
    saveList: function (): void {
      ListService.patchList(this.localList.id, {
        title: this.localList.title,
        width: this.localList.width,
        height: this.localList.height,
        backgroundColour: this.localList.backgroundColour,
        id: this.localList.id,
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
      let hsl: string[] = hslReg.exec(this.localList.backgroundColour!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%)`,
      };
    },
    updateTaskTrackerTitle: function (newTitle: string): void {
      this.localList.title = newTitle;
      this.saveList();
    },
    updateColor: function (newColor: string): void {
      let hslNewColor = tinyColor(newColor).toHslString();
      this.localList.backgroundColour = hslNewColor;
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
      this.localList.backgroundColour = colour;
    },
    calculateTaskPosition: function (id: number): TaskPosition {
      return this.taskPositionsObjectParent[id];
    },
    passTaskPositonsToModal: function (taskPositons: TasksPositionObject) {
      this.taskPositionsObjectParent = taskPositons;
    },
    addNewTaskToTasks: function (task: TodoType): void {
      task.id = this.localTasks.length + 1;
      this.localTasks.push(task);
      this.buttonText = "Add a Task";
      this.updatePositionsWithIndexes();
      this.recordHeight();
    },
    sortIndexes: function (elems: TodoType[]) {
      elems.sort(function (a, b) {
        return a.position - b.position;
      });
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
    finishedPatch: function (): void {
      this.isPatch = false;
    },
    updateList: function (task: TodoType): void {
      this.taskPassUpdate = task;
      let indexOld: number = _.keys(_.pickBy(this.localTasks, { id: task.id }));
      this.localTasks.splice(indexOld, 1, task);
    },
    updatePositionsWithIndexes() {
      this.localTasks.forEach((task, index) => {
        task.position = index;
      });
    },
    deleteTask: function (id: number) {
        this.localTasks = this.localTasks.filter((task) => {
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
    showEmptyMessage: function (): boolean {
      let show: boolean;
      if( this.emptyMessage && this.showAddTask){
        show = false;
      } else if ( this.emptyMessage  && !this.showAddTask){
        show = true;
      } else {
        show = false;
      }
      return show
    },
    p5Message: function (): string {
      return "Choose a colour for " + this.localList.title;
    },
    emptyMessage: function (): Boolean {
      if (this.localTasks.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    iconBGHover: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.localList.backgroundColour!)!.slice(1, 4);
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
      if (this.localTasks) {
        length = this.localTasks.length;
      }
      return length;
    },
    calculatedBackgroundColor: function (): object {
      return {
        backgroundColor: this.localList.backgroundColour,
      };
    },
    calculatedTextColor: function (): object {
      if (tinyColor(this.localList.backgroundColour).isLight()) {
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
  padding: 1.5rem 1.5rem;
  border-radius: 14px;
  width: 340px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
transition: filter .1s ease;
  min-height: 33rem;
}

.task-tracker-wrap:first-of-type {
  margin-left: 0px;
} 

.task-tracker-wrap:hover .hiding__icon {
  visibility: visible;
  opacity: 1;
  padding: 15px;
  transform: scale(1);

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
  justify-content: space-around;
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
  transition: filter .2s ease;
}

.hiding__icon:hover {
  background-color: var(--bg-hov-color);
  filter: brightness(1.05);
}
.add__action {
  padding: 1rem 2.5rem;
  border-radius: 0.8rem;
  transition: transform .1s ease;
}

.task_tracker_display {
  width: 100%;
height:100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.add__action.icon:hover {
  transform: scale(1.1);
  
  filter: brightness(1.05);
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
