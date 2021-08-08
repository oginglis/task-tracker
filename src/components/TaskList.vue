<template>
  <div class="task_list padding-end">
    <draggable
      v-model="tasksModel"
      @start="drag = true"
      @end="drag = false"
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
      @change="onChange"
      class="task-list--remove-padding"
    >
      <template #item="{ element, index }">
        <Task
          @toggleTaskReminder="convertRemind(element)"
          @sendTaskPosition="sendUpTaskPosition(element.id, $event)"
          :task="element"
          :key="index"
          :style="backgroundColor(index)"
          @askToDeleteTask2="deleteTask2(element.id)"
          @click="askToUpdateTask3"
          @askToUpdateTask2="askToUpdateTask3"
          :ref="`Task ${element.id}`"
          :bgColor="listColour"
        />
      </template>
    </draggable>
    <NewAction :bgColor="listColour" />
  </div>
</template>

<script lang="ts">
import Task from "./Task.vue";
import { TaskType } from "@/types/Task";
import draggable from "vuedraggable";
import { TaskPosition } from "@/types/TaskPosition";
import { TasksPositionObject } from "@/types/TasksPositionObject";
import { defineComponent, PropType } from "vue";
import TaskService from "@/services/TaskService";
import NewAction from "./NewAction.vue";

export default defineComponent({
  name: "TaskList",
  components: {
    Task,
    draggable,
    NewAction,
  },
  filters: {
    reverse: function (value: Array<TaskType>) {
      return value.slice().reverse();
    },
  },
  data() {
    return {
      info: [] as TaskType[],
      drag: false,
      positionsObject: {} as TasksPositionObject,
    };
  },
  props: {
    taskData: Object as PropType<TaskType>,
    updateWithThisTask: {
      type: Object as PropType<TaskType>,
      default: () => ({
        title: "Arrow Function Expression",
      }),
    },
    listColour: String,
    tasks: {
      type: Array as PropType<Array<TaskType>>,
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
      get(): Array<TaskType> {
        return this.tasks;
      },
      set(value: TaskType) {
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
    backgroundColor: function (index: number): object {
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
    convertRemind: function (task: TaskType): void {
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
          serviceArray.push(TaskService.patchTask(task.id, task));
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
        top = (this.$refs[refName] as any).$el.getBoundingClientRect().top;
        left = (this.$refs[refName] as any).$el.getBoundingClientRect().left;
        let posObject: TaskPosition = { top: top, left: left };
        this.positionsObject[task.id] = posObject;
      });
      this.$emit("sendTaskPositions", this.positionsObject);
    },
    updatePositons: function () {
      this.tasks.forEach((task) => {
        task.position = 0;
      });
    },
    saveOrder: function (array: Array<TaskType>) {
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
.padding-end:last-child {
  padding-bottom: 10px;
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
}
</style>
