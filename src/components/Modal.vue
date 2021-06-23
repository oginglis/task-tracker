<template>
  <div v-show="isOpen" class="modal-wrapper center" :style="bgColor">
    <font-awesome-icon
      class="close-icon"
      icon="times-circle"
      @click="toggleOpenModal"
    ></font-awesome-icon>
    <h3 class="modal-title">Task:</h3>
    <p class="modal-info" contenteditable="true" @blur="update">
      {{ modalTitle }}
    </p>
    <h3 class="modal-title">Date:</h3>
    <input class="modal-date" v-model="modalDate" type="datetime-local" />
    <button @click="updateTaskCloseModal(taskId)">Update Task</button>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
library.add([faTimesCircle]);
export default {
  name: "Modal",
  data: function () {
    return {
      bgColor: {
        backgroundImage: `linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]})`,
        backgroundSize: "cover",
      },
      modalTitle: "",
      modalDate: Date,
      focusIn: false,
      taskId: null,
      modalReminder: false,
      dataChanged: false,
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
    id: {
      type: Number,
      default: null,
    },
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
        title: this.modalTitle,
        date: this.modalDate,
        reminder: this.modalReminder,
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
      this.modalTitle = e.target.innerText;
    },
    created() {
      this.modalTitle = this.task;
    },
  },
  computed: {
    momentDate2: function () {
      return moment(this.date).format("yyyy-MM-dd");
    },
  },
  watch: {
    date: function () {
      this.modalDate = this.date;
    },
    task: function () {
      this.modalTitle = this.task;
    },
    modalTitle: function (newVal) {
      if (!this.focusIn) {
        this.modalTitle = newVal;
      }
    },
    id: function () {
      this.taskId = this.id;
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
  background: rgba(105, 24, 24, 0);
  border: none;
  direction: ltr;
  unicode-bidi: bidi-override;
  max-width: 80%;
}

.modal-info:focus,
.modal-info:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}

.modal-date {
  background: rgba(105, 24, 24, 0.3);
  border: none;
  margin: 15px;
}

.modal-date:focus,
.modal-date:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}
</style>
