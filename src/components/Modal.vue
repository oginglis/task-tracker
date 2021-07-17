<template>
  <div
    v-click-outside="clickOutsideHandler"
    class="modal modal--center"
    :class="{ 'modal--green-reminder': task.reminder }"
    :style="modalPositionStyle"
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
    <Datepicker
      class="modal__date"
      id="date"
      v-model="parsedDate"
      :clearable="true"
    />

    <button class="modal__submit" @click="updateTaskCloseModal(modalTask.id)">
      Update Task
    </button>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import Datepicker from "vue3-datepicker";
import { defineComponent, PropType } from "vue";
import TaskService from "@/services/TaskService";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import vClickOutside from "v-click-outside";

library.add([faTimesCircle] as any);
import { TaskType } from "@/types/Task";

export default defineComponent({
  name: "Modal",
  components: {
    Datepicker,
  },
  data: function () {
    return {
      modalTask: {} as TaskType,
      focusIn: false,
      dataChanged: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    task: {
      type: Object as PropType<TaskType>,
      default: () => ({
        title: "this is a detault",
      }),
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
    updateTaskCloseModal: function (id: number): void {
      this.toggleOpenModal();
      let update = {
        title: this.modalTask.title,
        date: this.modalTask.date,
        reminder: this.modalTask.reminder,
        positon: this.modalTask.position,
        id: id,
      };

      // Make Axios request with the data from the task
      TaskService.patchTask(id, update)
        .then(() => {})
        .catch(function (error) {
          console.log(error);
        });

      this.$emit("rerender", update);
    },
    update: function (e: any): void {
      this.modalTask.title = e.target.innerText;
    },
    clickOutsideHandler(): void {
      this.$emit("clickOutside");
    },
    mounted(): void {
      console.log("mounted");
    },
  },
  computed: {
    momentDate2: function (): String {
      return moment(this.task.date).format("yyyy-MM-dd");
    },
    parsedDate: {
      get: function (): Date {
        return new Date(this.modalTask.date);
      },
      set: function (newValue: string) {
        this.modalTask.date = newValue;
      },
    },
    modalPositionStyle: function () {
      let styleObject = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
      return styleObject;
    },
  },
  watch: {
    "task.date": function () {
      this.modalTask.date = this.task.date;
    },
    "task.title": function () {
      this.modalTask.title = this.task.title;
    },
    modalTitle: function (newVal) {
      if (!this.focusIn) {
        this.modalTask.title = newVal;
      }
    },
    "task.id": function () {
      this.modalTask.id = this.task.id;
    },
  },
});
</script>

<style scoped>
.modal {
  width: 500px;
  box-sizing: border-box;
  min-width: 400px;
  min-height: 200px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 10px;
  box-shadow: 0px 0px 100px 30px black;
  background-color: #f8f8f8;
  padding: 20px;
}
.modal--center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.modal--green-reminder {
  border-left: green solid 10px;
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
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
}
.modal__info {
  font-size: 1.2em;
  font-weight: bold;
  background: rgba(105, 24, 24, 0);
  border: none;
  direction: ltr;
  unicode-bidi: bidi-override;
  max-width: 80%;
  text-align: left;
  margin: 0rem;
}

.modal__info:focus,
.modal__info:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}

.modal__date {
  background: rgba(105, 24, 24, 0.3);
  border: none;
  margin: 1rem 0px;
  cursor: pointer;
}

.modal__date:focus,
.modal__date:hover {
  outline: none;
  background: rgba(105, 24, 24, 0.1);
}

.modal__submit {
  margin-top: 1rem;
}
</style>
