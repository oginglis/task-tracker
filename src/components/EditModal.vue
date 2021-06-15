<template>
  <div v-show="isOpen" class="modal-wrapper center" :style="bgColor">
    <font-awesome-icon
      class="close-icon"
      icon="times-circle"
      @click="toggleOpenModal"
    ></font-awesome-icon>
    <h3>{{ task }}</h3>
    <p>{{ date }}</p>
  </div>
</template>

<script>
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
  },
  computed: {},
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
</style>
