<template>
  <div
    class="task-wrapper"
    :style="style"
    :class="{ reminder: isTrueSet, editTask: editTask }"
  >
    <div class="left-task-content">
      <h1 class="task-height task-title">{{ title }}</h1>
      <h2 class="task-date">{{ momentDate }}</h2>
    </div>
    <div class="right-task-content">
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
      type: String,
      default: "false",
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
.task-wrapper {
  width: 500px;
  margin: 0 auto;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}

.left-task-content {
  text-align: left;
  color: black;
}

.task-title {
  font-size: 1.2em;
}

.task-date {
  font-size: 10px;
}
.task-height {
  max-height: 3.6em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  line-height: 1.2em;
}
.right-task-content {
  display: flex;
  align-content: space-between;
  height: 100%;
}
.reminder {
  border-left: 10px solid green;
}

.edit-task {
  border: 10px solid yellow;
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
