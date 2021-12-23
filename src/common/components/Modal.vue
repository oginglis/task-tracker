<template>
  <div
    v-click-outside="clickOutsideHandler"
    class="modal modal--center"
    :class="{ 'modal--green-reminder': task.reminder }"
    :style="[modalPositionStyle, modalColourStyles]"
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
    <font-awesome-icon
      @click="handleBellClick"
      class="modal__icon"
      icon="bell"
      :class="{
        'modal__icon__bellactive animate__animated animate__headShake':
          task.reminder,
      }"
    ></font-awesome-icon>
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
import { TodoType } from "@/types/Todo";
import { TaskPosition } from "@/types/TaskPosition";

export default defineComponent({
  name: "Modal",
  components: {
    Datepicker,
  },
  data: function () {
    return {
      modalTask: {} as TodoType,
      focusIn: false,
      dataChanged: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    task: {
      type: Object as PropType<TodoType>,
      default: () => ({
        title: "This is a demo tasks",
        date: "2021-07-07T13:51",
        reminder: true,
        completed: false,
        position: 1,
        id: 1202,
      }),
    },
    taskPosition: {
      type: Object as PropType<TaskPosition>,
    },
    modalColour: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },
  },
  created() {
    this.modalTask.title = this.task.title;
    this.modalTask.date = this.task.date;
    this.modalTask.id = this.task.id;
    this.modalTask.completed = this.task.completed;
    this.modalTask.reminder = this.task.reminder;
  },
  methods: {
    handleBellClick: function () {
      this.$emit("toggleReminder", this.task);
    },
    toggleOpenModal: function () {
      this.$emit("toggleOpenModal");
    },
    updateTaskCloseModal: function (id: number): void {
      this.toggleOpenModal();
      let update = {
        title: this.modalTask.title,
        date: this.modalTask.date,
        reminder: this.modalTask.reminder,
        position: this.modalTask.position,
        completed: this.modalTask.completed,
        id: id,
      };
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
    modalPositionStyle: function (): object {
      let styleObject = {
        position: "absolute",
        left: `${this.taskPosition?.left}px`,
        top: `${this.taskPosition?.top}px`,
        // transform: "translate(-50%, -50%)",
      };
      return styleObject;
    },
    modalColourStyles: function () {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.modalColour!)!.slice(1, 4);

      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
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
  font-weight: initial;
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
  border: 1px black solid;
}
.modal--center {
  position: absolute;
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
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
}
.modal__info {
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

.modal__icon {
  display: inline;
  margin-right: 10px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}
.modal__icon:hover {
  cursor: pointer;
}

.modal__icon__bellactive {
  color: green;
}
</style>
