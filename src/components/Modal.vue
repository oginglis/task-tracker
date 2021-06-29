<template>
  <div
    v-click-outside="clickOutsideHandler"
    class="modal modal--center"
    :style="bgColor"
  >
    <font-awesome-icon
      class="modal__close-icon"
      icon="times-circle"
      @click="toggleOpenModal"
    ></font-awesome-icon>
    <h3 class="modal__title">Task:</h3>
    <p class="modal__info" contenteditable="true" @blur="update">
      {{ modalTask.title }}
    </p>
    <h3 class="modal__title">Date:</h3>
    <input class="modal__date" v-model="modalTask.date" type="datetime-local" />
    <button @click="updateTaskCloseModal(taskId)">Update Task</button>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import vClickOutside from "v-click-outside";
library.add([faTimesCircle]);
export default {
  name: "Modal",
  data: function () {
    return {
      bgColor: {
        backgroundImage: `linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]})`,
        backgroundSize: "cover",
      },
      modalTask: {
        title: "",
        date: Date,
        id: null,
        reminder: false,
      },
      focusIn: false,
      dataChanged: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    task: {
      title: {
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
      id: {
        type: Number,
        default: null,
      },
    },
    taskColor: {
      type: Array,
      default: () => {
        return ["#FFC300", "#C7003A"];
      },
    },
  },
  created() {
    this.modalTask.title = this.task.title;
    this.modalTask.date = this.task.date;
    this.modalTask.id = this.task.id;
    this.modalTask.reminder = this.task.reminder;
  },
  methods: {
    toggleOpenModal: function () {
      this.$emit("toggleOpenModal");
    },
    style: function () {
      return `background-color: linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]}); background-size: cover; `;
    },
    updateTaskCloseModal: function (id) {
      this.toggleOpenModal();
      let update = {
        title: this.modalTask.title,
        date: this.modalTask.date,
        reminder: this.modalTask.reminder,
        id: id,
      };
      // Make Axios request with the data from the task
      axios
        .patch(`http://localhost:3000/tasks/${id}`, update)
        .then(() => {})
        .catch(function (error) {
          console.log(error);
        });

      this.$emit("rerender", update);
    },
    update: function (e) {
      this.modalTask.title = e.target.innerText;
    },
    clickOutsideHandler() {
      this.$emit("clickOutside");
    },
    mounted() {
      console.log("mounted");
    },
  },
  computed: {
    momentDate2: function () {
      return moment(this.task.date).format("yyyy-MM-dd");
    },
  },
  watch: {
    "task.date": function () {
      this.modalDate = this.task.date;
    },
    "task.title": function () {
      this.modalTitle = this.task.title;
    },
    modalTitle: function (newVal) {
      if (!this.focusIn) {
        this.modalTitle = newVal;
      }
    },
    "task.id": function () {
      this.taskId = this.task.id;
    },
  },
};
</script>

<style scoped>
.modal {
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
.modal--center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.modal__close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
}

.modal__close-icon :hover {
  color: grey;
  cursor: pointer;
}

.modal__title {
  font-size: 20px;
  margin: 0px;
}
.modal__info {
  font-size: 15px;
  background: rgba(105, 24, 24, 0);
  border: none;
  direction: ltr;
  unicode-bidi: bidi-override;
  max-width: 80%;
}

.modal__info:focus,
.modal__info:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}

.modal__date {
  background: rgba(105, 24, 24, 0.3);
  border: none;
  margin: 15px;
}

.modal__date:focus,
.modal__date:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}
</style>
