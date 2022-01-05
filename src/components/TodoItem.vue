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
    <Icon
      type="trash"
      class="icon icon--hide"
      @iconClicked="askToDeleteTask(task.id)"
      :bgColor="bgColor"
      :borderStyles="true"
    />
    <div
      class="task__body"
      :class="{ 'task__body--compensate-margin': task.reminder }"
    >
      <h1 class="task__body__content task__body__content--restrict noselect">
        {{ task.title }}
      </h1>
    </div>
    <Icon
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
import { TodoType } from "@/types/Todo";
import { TaskPosition } from "@/types/TaskPosition";
import Icon from "../common/components/Icon.vue";
import moment from "moment";
library.add([faTimes, faCheck, faBell] as any);
export default defineComponent({
  name: "TodoItem",
  components: { Icon },
  data() {
    return {
      editTask: false,
      taskPosition: {} as TaskPosition,
      bellShakeAllowed: false,
    };
  },
  props: {
    task: {
      type: Object as PropType<TodoType>,
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
  unmounted() {

  },
});
</script>

<style scoped>
.task {
  margin: 5px auto;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  transition: filter 0.2s ease;
  text-overflow: ellipsis;
  transition: transform 1.5s cubic-bezier(0.64, 0.57, 0.67, 1.53) 
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
  transition: transform 1.5s cubic-bezier(0.64, 0.57, 0.67, 1.53) 
}

.task--green-reminder {
  border-left: 10px solid green;
}

.task__body {
  text-align: center;
  width: 70%;
  margin-left: 0px;
}

.task__body__content {
  font-size: 1em;
  font-weight: initial;
  min-height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.task__body__content--restrict {
  overflow: hidden;
  white-space: normal;
  line-height: 1.2em;
  text-overflow: ellipsis;
}

.task__body--compensate-margin {
  margin-left: -10px;
}

.icon--hide {
  /* display: none; */
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  transition: transform 1.5s cubic-bezier(0.64, 0.57, 0.67, 1.53) 
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.task:hover .icon--hide:hover {
  transform: scale(1.5);

}
</style>
