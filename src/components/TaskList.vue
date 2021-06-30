<template>
  <div class="padding-end">
    <draggable
      v-model="tasksModel"
      group="people"
      @start="drag = true"
      @end="drag = false"
      v-bind="dragOptions"
      @change="onChange"
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
          v-on:askToDeleteTask2="deleteTask2(task.id)"
          v-on:askToUpdateTask2="askToUpdateTask3"
          :taskColor="getGradientColors(index)"
        />
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import Task from "./Task.vue";
import draggable from "vuedraggable";
import Gradient from "javascript-color-gradient";

export default {
  name: "TaskList",
  components: {
    Task,
    draggable,
  },
  data() {
    return {
      info: null,
      colours: [],
      colourPairs: [],
      drag: false,
    };
  },
  props: {
    taskData: Object,
    updateWithThisTask: Object,
    tasks: Array,
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
      get() {
        return this.tasks;
      },
      set(value) {
        this.$emit("update:tasks", value);
      },
    },
  },
  created() {
    console.log("Child created ", this.tasks);
    let colorGradient = new Gradient();
    const color1 = "#FFC300";
    const color2 = "#C7003A";
    colorGradient.setMidpoint(this.tasks.length * 2);
    colorGradient.setGradient(color1, color2);
    this.colours = colorGradient.getArray();
  },
  mounted() {
    console.log("Child mounted ", this.tasks);
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
    askToUpdateTask3: function (id) {
      let taskToUpdate = this.tasks.filter((task) => task.id == id);
      this.$emit("askToUpdateTask4", taskToUpdate);
    },
    convertRemind: function (task) {
      if (task.reminder == false) {
        task.reminder = true;
      } else {
        task.reminder = false;
      }
    },
    getGradientColors: function (index) {
      while (this.colours.length > 0) {
        this.colourPairs.push(this.colours.splice(0, 2));
      }
      return this.colourPairs[index];
    },
    sortList: function () {
      this.info.reverse();
    },
    onChange: function (e) {
      console.log(e);
    },
    deleteTask2: function (id) {
      this.$emit("askToDeleteTask", id);
    },
  },
};
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
</style>
