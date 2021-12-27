<template>
  <div class="task_list padding-end">
    <draggable
      class="task-list--remove-padding"
      @start="drag = true"
      @end="drag = false"
      @change="onChange"
      v-model="tasksModel"
      tag="transition-group"
      item-key="id"
      direction="horizontal"
      delay="10"
      v-bind="dragOptions"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
    >
      <template #item="{ element, index }">
        <TodoItem
          @toggleTaskReminder="convertRemind(element)"
          @sendTaskPosition="sendUpTaskPosition(element.id, $event)"
          @askToDeleteTask2="deleteTask2(element.id)"
          @click="askToUpdateTask3"
          @askToUpdateTask2="askToUpdateTask3"
          :task="element"
          :key="index"
          :style="setBackgroundColor(index)"
          :ref="`Task ${element.id}`"
          :bgColor="listColour"
        />
      </template>
    </draggable>
    <transition :name="transitonName" v-on:after-leave="notifyAdderExit">
      <TodoCreator
        v-if="showActionAdder"
        @clickOutsideActionAdder="emitToggleActionAdder"
        @addNewAction="emitNewTodo"
        :bgColor="listColour"
        :key="componentKey"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import TodoItem from "./TodoItem.vue";
import { TodoType } from "@/types/Todo";
import draggable from "vuedraggable";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import { defineComponent, PropType } from "vue";
import TaskService from "@/services/TaskService";
import TodoCreator from "./TodoCreator.vue";

export default defineComponent({
  name: "TodoList",
  components: {
    TodoItem,
    draggable,
    TodoCreator,
  },
  filters: {
    reverse: function (value: Array<TodoType>) {
      return value.slice().reverse();
    },
  },
  data() {
    return {
      info: [] as TodoType[],
      drag: false,
      positionsObject: {} as TasksPositionObject,
      componentKey: 0,
      transitonName: "slide-fade",
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$emit("removedActions");
    });
  },
  props: {
    taskData: Object as PropType<TodoType>,
    updateWithThisTask: {
      type: Object as PropType<TodoType>,
      default: () => ({
        title: "Arrow Function Expression",
      }),
    },
    showActionAdder: {
      type: Boolean,
    },
    listColour: String,
    tasks: {
      type: Array as PropType<Array<TodoType>>,
      default: () => [
        {
          title: "New tasks ",
          date: "0002-03-12T12:03",
          reminder: true,
          position: 3,
          id: 14027,
        },
        {
          title: "This is a test of the list to see if one opens correctly",
          date: "2021-06-30T21:55",
          reminder: false,
          position: 0,
          listid: 1,
          id: 14028,
        },
      ],
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    tasksModel: {
      get(): Array<TodoType> {
        return this.tasks;
      },
      set(value: TodoType) {
        this.$emit("update:tasks", value);
      },
    },
  },
  created() {
    window.addEventListener("resize", this.updateAndSendPositions);
  },

  watch: {
    updateWithThisTask: function () {
      var foundIndex = this.info.findIndex(
        (x) => x.id == this.updateWithThisTask.id
      );
      this.info.splice(foundIndex, 1, this.updateWithThisTask);
    },
  },
  mounted: function () {
    this.updateAndSendPositions();
  },
  methods: {
    notifyAdderExit: function (): void {
      this.$emit("adderLeft");
    },
    forceRerenderTodoAdder() {
      this.componentKey += 1;
    },
    emitNewTodo: function (newTodo: any): void {
      if (newTodo == ({} as TodoType)) {
        this.transitonName = "fade";
        this.$emit("addTempActionToList", newTodo);
        this.forceRerenderTodoAdder();
      } else {
        this.transitonName = "slide-fade";
        this.$emit("addTempActionToList", newTodo);
        this.forceRerenderTodoAdder();
      }
    },
    emitToggleActionAdder: function () {
      this.$emit("clickedOutsideActionAdder");
    },
    setBackgroundColor: function (index: number): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.listColour!)!.slice(1, 4);
      if (index % 2 == 0) {
        return {
          backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
        };
      } else {
        return {
          backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
        };
      }
    },
    askToUpdateTask3: function (id: Number) {
      let taskToUpdate = this.tasks.filter((task) => task.id == id);
      this.$emit("askToUpdateTask4", taskToUpdate);
    },
    convertRemind: function (task: TodoType): void {
      if (task.reminder == false) {
        task.reminder = true;
      } else {
        task.reminder = false;
      }
      TaskService.patchTask(task.id, task).catch(function (error) {
        console.log(error);
      });
    },

    sortList: function (): void {
      this.info.reverse();
    },
    onChange: function (e: any) {
      const {
        moved: { oldIndex, newIndex },
      } = e;
      this.tasksModel.forEach((task, index) => {
        task.position = index;
      });
      const largestIndex = Math.max(oldIndex, newIndex);
      const serviceArray: Promise<any>[] = [];
      this.tasksModel.forEach((task) => {
        if (task.position <= largestIndex) {
          serviceArray.push(TaskService.patchTask(task.id, task).catch(function (error) {
          console.log(error);
        }));
        }
      });
      Promise.all(serviceArray).catch((errors) => {
        console.log(errors);
      });
      this.updateAndSendPositions();
    },
    deleteTask2: function (id: number) {
      this.$emit("askToDeleteTask", id);
    },
    updateAndSendPositions: function (): void {
      this.tasksModel.forEach((task) => {
        let refName: string = `Task ${task.id}`;
        let top: number, left: number;
        if (this.$refs[refName]) {
          top = (this.$refs[refName] as any).$el.getBoundingClientRect().top;
          left = (this.$refs[refName] as any).$el.getBoundingClientRect().left;
          let posObject: TaskPosition = { top: top, left: left };
          this.positionsObject[task.id] = posObject;
        }
      });
      this.$emit("sendTaskPositions", this.positionsObject);
    },
    updatePositons: function () {
      this.tasks.forEach((task) => {
        task.position = 0;
      });
    },
    saveOrder: function (array: Array<TodoType>) {
      // TO DO: Make patch requests on all tasks that have had their position updated using their id
      return array;
    },
    sendUpTaskPosition: function (
      taskId: number,
      taskPosition: TaskPosition
    ): void {
      this.positionsObject[taskId] = taskPosition;

      this.$emit("sendUpTaskPositonAgain", taskPosition);
    },
  },
});
</script>

<style scoped>
.task_list {
  width: 100%;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.task--light-grey-background {
  background-color: rgb(233, 233, 233);
  transition: background-color 0.5s ease;
}
.task--darker-grey-background {
  background-color: rgb(214, 214, 214);
  transition: background-color 0.5s ease;
}

.task-list--remove-padding {
  padding-left: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  width: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.2s ease-in;
}

.fade-enter-from {
  opacity: 0;
  width: 0;
  transform: scale(0);
}
</style>
