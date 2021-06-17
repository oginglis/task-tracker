<template>
  <div v-show="isOpen" class="modal-wrapper center" :style="bgColor">
    <font-awesome-icon
      class="close-icon"
      icon="times-circle"
      @click="toggleOpenModal"
    ></font-awesome-icon>
    <h3 class="modal-title">Task:</h3>
    <h3 class="modal-info">{{ task }}</h3>
    <h3 class="modal-title">Date:</h3>
    <p class="modal-info">{{ momentDate2 }}</p>
    <button @click="updateTaskCloseModal">Update Task</button>
  </div>
</template>

<script>
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
library.add([faTimesCircle]);
export default {
  name: "EditModal",
  data: function () {
    return {
      bgColor: {
        backgroundImage: `linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]})`,
        backgroundSize: "cover",
      },
    };
  },
  props: {
    isOpen: {
      default: false,
      type: Boolean,
    },
    task: {
      default: " This is a task to tesk",
      type: String,
    },
    date: {
      default: "20-July 101",
      type: String,
    },
    reminder: {
      default: false,
      type: Boolean,
    },
    taskColor: {
      type: Array,
      default: () => {
        return ["#FFC300", "#C7003A"];
      },
    },
  },
  methods: {
    toggleOpenModal: function () {
      this.$emit("toggleOpenModal");
    },
    style: function () {
      return `background-color: linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]}); background-size: cover; `;
    },
    updateTaskCloseModal: function () {
      this.toggleOpenModal();
      // Make Axios request with the data from the task
    },
  },
  computed: {
    momentDate2: function () {
      return moment(this.date).format("MMM Do YYYY");
    },
  },
};
</script>

<style scoped>
.modal-wrapper {
  height: 40vh;
  width: 40vw;
  min-width: 400px;
  min-height: 200px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  box-shadow: 0px 0px 100px 30px black;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
}

.close-icon:hover {
  color: grey;
  cursor: pointer;
}

.modal-title {
  font-size: 20px;
  margin: 0px;
}
.modal-info {
  font-size: 15px;
}
</style>
