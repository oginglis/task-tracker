<template>
  <div class="padding-end">
    <draggable
      v-model="tasks"
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
          :reminder="task.reminder.toString()"
          :key="task.id"
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
  },
  created() {
    console.log("created in child");
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
      if (task.reminder == "false") {
        task.reminder = "true";
      } else {
        task.reminder = "false";
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
