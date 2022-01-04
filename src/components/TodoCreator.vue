<template>
  <transition :name="transitonName">
    <div
      class="New-action"
      :style="newBGColor"
      v-click-outside="clickOutsideHandler"
    >
      <p
        class="enter-text"
        contenteditable="true"
        v-focus
        @blur="createAction($event)"
        @keydown.enter.prevent="triggerBlur($event)"
        @keydown="updateActionTitle($event)"
      ></p>
      <p class="faded-text" v-if="!action.title">New Action</p>
    </div>
  </transition>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import TaskService from "../services/TaskService";
import { TodoType } from "@/types/Todo";
export default defineComponent({
  name: "TodoCreator",
  data: function () {
    return {
      action: {} as TodoType,
      transitonName: "slide-fade",
    };
  },
  props: {
    bgColor: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },
    list_id: Number
    
  },

  mounted() {
    if(this.list_id){
      this.action.listId = this.list_id;
    }

  },
  methods: {
    updateActionTitle: function (e: KeyboardEvent): void {
      if ((e.target as HTMLInputElement).innerText === "") {
        this.action.title = e.key;
      } else {
        this.action.title = (e.target as HTMLInputElement).innerText;
      }
    },
    clickOutsideHandler: function (): void {
      this.$emit("clickOutsideActionAdder");
    },
    createAction: function (e: Event): void {
      this.action.title = (e.target as HTMLInputElement).innerText;
      
      if (this.action.title != "") {
        this.$emit("addNewAction",  this.action);
        this.action.id = Math.random()*100;
        TaskService.postTask(this.action)
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    triggerBlur: function (e: Event): void {
      (e.target as HTMLElement).blur();
    },
  },
  computed: {
    newBGColor: function () {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.bgColor!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
    },
  },
});
</script>

<style scoped>
.New-action {
  margin: 0px auto;
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  transition: filter 0.2s ease;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  position: relative;
}
.New-action:hover {
  cursor: text;
  filter: brightness(0.95);
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.enter-text {
  width: 100%;
  -webkit-appearance: none;
}

[contenteditable="true"]:focus,
[contenteditable="true"]:focus {
  outline: none;
}

.faded-text {
  opacity: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 2.2rem;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  width: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.2s ease-in;
}

.fade-enter-from {
  opacity: 0;
  width: 0;
  transform: scale(0);
}
</style>
