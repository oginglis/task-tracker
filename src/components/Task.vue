<template>
  <div
    class="task"
    :class="[
      task.reminder ? 'task--green-reminder' : '',
      editTask ? 'editTask' : '',
    ]"
  >
    <div
      class="task__lhs"
      :class="{ 'task__lhs--compensate-margin': task.reminder }"
    >
      <h1 class="task__lhs__title task__lhs__title--restrict">
        {{ task.title }}
      </h1>
      <h2 class="task__lhs__date">{{ momentDate }}</h2>
    </div>
    <div class="task__rhs">
      <font-awesome-icon
        @click="toggleRemider"
        class="fa-spacer"
        icon="bell"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="askToUpdateTask(task.id)"
        class="fa-spacer"
        icon="edit"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="askToDeleteTask(task.id)"
        class="fa-spacer"
        icon="times-circle"
      ></font-awesome-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { defineComponent } from "vue";
import {
  faTimesCircle,
  faEdit,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { PropType } from "vue";
import { TaskType } from "@/types/Task";
import moment from "moment";
library.add([faTimesCircle, faEdit, faBell] as any);
export default defineComponent({
  name: "Task",
  components: {},
  data() {
    return {
      editTask: false,
    };
  },
  props: {
    task: {
      type: Object as PropType<TaskType>,
      default: () => ({
        title: "Arrow Function Expression",
      }),
    },
  },
  computed: {
    isTrueSet: function () {
      if (this.task.reminder == true) {
        return true;
      } else {
        return false;
      }
    },

    momentDate: function (): string {
      var newDt: any = moment(this.task.date, "MM/DD/YY");
      return moment(newDt).format("MMM Do YYYY");
    },
  },
  methods: {
    askToDeleteTask: function (id: number): void {
      this.$emit("askToDeleteTask2", id);
    },
    askToUpdateTask: function (id: number): void {
      this.$emit("askToUpdateTask2", id);
      if (this.editTask == false) {
        this.editTask = true;
      } else {
        this.editTask = false;
      }
    },
    toggleRemider: function () {
      this.$emit("toggleReminda");
    },
  },
});
</script>

<style scoped>
.task {
  margin: 5px auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}

.task:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.task--green-reminder {
  border-left: 10px solid green;
}

.task__lhs {
  text-align: left;
  color: black;
  margin-left: 0px;
}

.task__lhs__title {
  font-size: 1.2em;
}

.task__lhs__date {
  font-size: 10px;
}

.task__lhs__title--restrict {
  max-height: 3.6em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  line-height: 1.2em;
}

.task__lhs--compensate-margin {
  margin-left: -10px;
}

.task__rhs {
  display: flex;
  align-content: space-between;
  height: 100%;
}

.fa-spacer {
  margin: 5px;
  color: black;
}
.fa-spacer:hover {
  color: green;
  cursor: pointer;
}
</style>
