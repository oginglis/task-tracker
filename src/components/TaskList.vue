<template>
  <div class="padding-end">
    <draggable
      v-model="tasksModel"
      group="description"
      @start="drag = true"
      @end="drag = false"
      tag="transition-group"
      item-key="id"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
        class: 'task-list--remove-padding',
      }"
      @change="onChange"
    >
      <template #item="{ element, index }">
        <Task
          @toggleReminda="convertRemind(element)"
          :task="element"
          :key="element.id"
          :class="backgroundColor(index)"
          v-on:askToDeleteTask2="deleteTask2(element.id)"
          v-on:askToUpdateTask2="askToUpdateTask3"
        />
      </template>
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
