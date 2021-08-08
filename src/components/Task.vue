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
    <ClickableIcon
      type="trash"
      class="icon icon--hide"
      @iconClicked="askToDeleteTask(task.id)"
      :bgColor="bgColor"
      :borderStyles="true"
    />
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
    <ClickableIcon
      type="check"
      class="icon icon--hide"
      :bgColor="bgColor"
      :width="`0.9rem`"
      :height="`0.9rem`"
      :borderStyles="true"
    />
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
import ClickableIcon from "./ClickableIcon.vue";
import moment from "moment";
library.add([faTimes, faCheck, faBell] as any);
export default defineComponent({
  name: "Task",
  components: { ClickableIcon },
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
    bgColor: {
      type: String,
      default: "hsl(39, 81%, 73%)",
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
    styleIcon: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;

      let hsl: string[] = hslReg.exec(this.bgColor!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 20}%`,
        border: `0.4rem solid hsl(${hsl[0]},${hsl[1]}%,${
          parseInt(hsl[2]) + 10
        }% `,
        "--color-hover": `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 45}%`,
      };
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
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  transition: filter 0.2s ease;
  text-overflow: ellipsis;
}

.task:hover {
  cursor: grab;
  filter: brightness(0.95);
}

.task:hover .icon--hide {
  height: 0.9rem;

  visibility: visible;
  opacity: 1;
  transform: scale(1.2);
  background-color: var(--color-hover);
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
  overflow: hidden;
  white-space: normal;
  line-height: 1.2em;
  text-overflow: ellipsis;
}

.task_middle--compensate-margin {
  margin-left: -10px;
}

.task__rhs {
  display: flex;
  align-content: space-between;
  height: 100%;
}

.icon--hide {
  /* display: none; */
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
}
</style>
