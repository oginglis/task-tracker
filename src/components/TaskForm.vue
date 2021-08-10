<template>
  <div class="form">
    <form ref="inputForm" :style="formColourStyles">
      <label for="title">Task</label>
      <input
        class="v-spacer task-box-input"
        type="text"
        name="title"
        id="title"
        placeholder="Add task"
        v-model="task.title"
      />
      <span
        ><font-awesome-icon
          class="form__icon"
          icon="calendar-alt"
          @click="handleCalendarClick"
        ></font-awesome-icon>
        <font-awesome-icon
          @click="handleBellClick"
          class="form__icon"
          icon="bell"
          :class="{
            'form__icon__bellactive animate__animated animate__headShake':
              task.reminder,
          }"
        ></font-awesome-icon
      ></span>

      <label v-if="isCalendarVisible" class="form__date" for="date"
        >Date & Time:</label
      >

      <Datepicker
        class="v-spacer form__date--input"
        id="date"
        v-model="task.date"
        :clearable="true"
        v-if="isCalendarVisible"
      />

      <button @click="submitForm" class="v-spacer">Save Task</button>
    </form>
  </div>
</template>
<script lang="ts">
import TaskService from "@/services/TaskService";
import { defineComponent } from "vue";
import { TaskType } from "@/types/Task";
import Datepicker from "vue3-datepicker";
import { library } from "@fortawesome/fontawesome-svg-core";
import "animate.css";
import { faCalendarAlt, faBell } from "@fortawesome/free-solid-svg-icons";

library.add([faCalendarAlt, faBell] as any);

export default defineComponent({
  name: "TaskForm",
  data: function () {
    return {
      task: {} as TaskType,
      isCalendarVisible: false,
    };
  },
  components: {
    Datepicker,
  },
  watch: {},
  props: {
    taskCount: Number,
    formColour: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },
  },
  mounted() {
    console.log("Action Adder mounted");
  },
  unmounted() {
    console.log("Action Adder removed");
  },
  methods: {
    handleCalendarClick: function (): void {
      this.isCalendarVisible = !this.isCalendarVisible;
    },
    handleBellClick: function (): void {
      switch (this.task.reminder) {
        case undefined:
          this.task.reminder = true;
          break;
        case true:
          this.task.reminder = false;
          break;
        case false:
          this.task.reminder = true;
          break;
      }
    },
    submitForm: function (e: Event) {
      e.preventDefault();
      if (this.task.reminder == undefined) {
        this.task.reminder = false;
      }
      if (this.task.completed == undefined) {
        this.task.completed = false;
      }
      TaskService.postTask(this.task).catch(function (error) {
        console.log(error);
      });
      this.$emit("newTaskCreated", this.task);
    },
  },
  computed: {
    formColourStyles: function () {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.formColour!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
    },
  },
});
</script>

<style scoped>
#task-input {
  display: inline;
  width: 100%;
  align-self: end;
}

.form {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
form {
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: flex-start;

  margin: 0 auto;
  border-radius: 10px;

  background-size: cover;
}

.task-box-input {
  width: 80%;

  margin: 100px;
  align-self: end;
}
.v-spacer {
  margin: 5px 0px;
}

.form__date,
.form__date--input {
  margin: 0.5rem 0rem;
}

.form__icon {
  display: inline;
  margin-right: 10px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}
.form__icon:hover {
  cursor: pointer;
}

.form__icon__bellactive {
  color: green;
}
</style>
