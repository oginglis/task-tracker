<template>
  <div
    class="task"
    :class="[
      task.reminder ? 'task--green-reminder' : '',
      editTask ? 'editTask' : '',
    ]"
    :ref="createTaskName"
    @click="askToUpdateTask(task.id)"
  >
    <font-awesome-icon
      @click="askToDeleteTask(task.id)"
      class="fa-spacer"
      icon="check"
    ></font-awesome-icon>
    <div
      class="task_middle"
      :class="{ 'task_middle--compensate-margin': task.reminder }"
    >
      <h1 class="task_middle__title task_middle__title--restrict">
        {{ task.title }}
      </h1>
      <h2 class="task_middle__date">
        {{ momentDate }}
      </h2>
    </div>

    <!-- <font-awesome-icon
      @click="toggleRemider"
      class="fa-spacer"
      icon="bell"
      :class="{
        'form__icon__bellactive animate__animated animate__headShake':
          task.reminder,
      }"
    ></font-awesome-icon> -->

    <font-awesome-icon
      @click="askToDeleteTask(task.id)"
      class="fa-spacer"
      icon="times"
    ></font-awesome-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import "animate.css";
import { faTimes, faCheck, faBell } from "@fortawesome/free-solid-svg-icons";
import { PropType } from "vue";
import { TaskType } from "@/types/Task";
import { TaskPosition } from "@/types/TaskPosition";
import moment from "moment";
library.add([faTimes, faCheck, faBell] as any);
export default defineComponent({
  name: "Task",
  components: {},
  data() {
    return {
      editTask: false,
      taskPosition: {} as TaskPosition,
      bellShakeAllowed: false,
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
      return moment(this.task.date).format("MMM Do YYYY");
    },
    createTaskName: function (): string {
      return `Task=${this.task.position}`;
    },
  },
  beforeMount() {},
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
    toggleRemider: function (): void {
      this.$emit("toggleTaskReminder");
    },
  },
  watch: {
    position: function () {
      this.$emit("sendTaskPosition", this.taskPosition);
    },
  },
  mounted() {
    let { top, left }: TaskPosition = this.$el.getBoundingClientRect();
    this.taskPosition.left = left;
    this.taskPosition.top = top;
    this.$emit("sendTaskPosition", this.taskPosition);
  },
});
</script>

<style scoped>
.task {
  margin: 5px auto;

  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}

.task:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.task:hover .fa-spacer {
  display: initial;
}

.task--green-reminder {
  border-left: 10px solid green;
}

.task_middle {
  text-align: center;
  width: 70%;
  margin-left: 0px;
}

.task_middle__title {
  font-size: 1em;
  font-weight: initial;
}

.task_middle__date {
  font-size: 0.6rem;
  font-weight: initial;
}

.task_middle__title--restrict {
  max-height: 3.6em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  line-height: 1.2em;
}

.task_middle--compensate-margin {
  margin-left: -10px;
}

.task__rhs {
  display: flex;
  align-content: space-between;
  height: 100%;
}

.fa-spacer {
  display: none;
  margin: 5px;
  color: black;
}
.fa-spacer:hover {
  color: green;
  cursor: pointer;
}
</style>
