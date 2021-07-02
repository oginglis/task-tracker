<template>
  <div class="padding-end">
    <draggable
      v-model="tasksModel"
      @start="drag = true"
      @end="drag = false"
      v-bind="dragOptions"
      @change="onChange"
      group="people"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <Task
          v-for="(task, index) in tasks"
          @toggleReminda="convertRemind(task)"
          :title="task.title"
          :date="task.date"
          :reminder="task.reminder"
          :key="index"
          :id="task.id"
          :class="backgroundColor(index)"
          v-on:askToDeleteTask2="deleteTask2(task.id)"
          v-on:askToUpdateTask2="askToUpdateTask3"
        />
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import Task from "./Task.vue";
import { TaskType } from "@/types/Task";
import draggable from "vuedraggable";
import { defineComponent, PropType } from "vue";
import TaskService from "@/services/TaskService";

export default defineComponent({
  name: "TaskList",
  components: {
    Task,
    draggable,
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
    tasks: {
      type: Array as PropType<Array<TaskType>>,
      default: () => [
        {
          title: "Arrow Function Expression",
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

  watch: {
    updateWithThisTask: function () {
      var foundIndex = this.info.findIndex(
        (x) => x.id == this.updateWithThisTask.id
      );
      this.info.splice(foundIndex, 1, this.updateWithThisTask);
    },
  },

  methods: {
    backgroundColor: function (index: number): string {
      if (index % 2 == 0) {
        return "task--light-grey-background";
      } else {
        return "task--darker-grey-background";
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
    },
    deleteTask2: function (id: number) {
      this.$emit("askToDeleteTask", id);
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
  },
});
</script>

<style scoped>
.padding-end:last-child {
  padding-bottom: 10px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.task--light-grey-background {
  background-color: rgb(233, 233, 233);
  transition: background-color 0.5s ease;
}
.task--darker-grey-background {
  background-color: rgb(214, 214, 214);
  transition: background-color 0.5s ease;
}
</style>
