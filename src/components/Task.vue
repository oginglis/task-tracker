<template>
  <div
    class="task"
    :style="style"
    :class="[
      reminder ? 'task--green-reminder' : '',
      editTask ? 'editTask' : '',
    ]"
  >
    <div
      class="task__lhs"
      :class="{ 'task__lhs--compensate-margin': reminder }"
    >
      <h1 class="task__lhs__title task__lhs__title--restrict">
        {{ title }}
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
        @click="askToUpdateTask(id)"
        class="fa-spacer"
        icon="edit"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="askToDeleteTask(id)"
        class="fa-spacer"
        icon="times-circle"
      ></font-awesome-icon>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimesCircle,
  faEdit,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
library.add([faTimesCircle, faEdit, faBell]);
export default {
  name: "Task",
  components: {},
  data() {
    return {
      editTask: false,
    };
  },
  props: {
    title: String,
    date: String,
    id: Number,
    reminder: {
      type: Boolean,
      default: false,
    },
    taskColor: Array,
  },
  computed: {
    isTrueSet: function () {
      if (this.reminder == "true") {
        return true;
      } else {
        return false;
      }
    },
    style: function () {
      return `background-image: linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]}); background-size: cover; `;
    },
    momentDate: function () {
      return moment(this.date).format("MMM Do YYYY");
    },
  },
  methods: {
    askToDeleteTask: function (id) {
      this.$emit("askToDeleteTask2", id);
    },
    askToUpdateTask: function (id) {
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
};
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
