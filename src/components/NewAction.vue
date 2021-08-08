<template>
  <button @click="show = !show">show</button>
  <transition name="slide-fade">
    <div
      v-if="show"
      class="New-action"
      :style="newBGColor"
      v-click-outside="clickOutsideHandler"
    >
      <p
        class="enter-text"
        contenteditable="true"
        v-focus
        v-if="inputIsVisible"
      ></p>

      <p class="faded-text">New Action</p>
    </div>
  </transition>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import vClickOutside from "v-click-outside";
export default defineComponent({
  name: "NewAction",
  data: function () {
    return {
      show: true,
      inputIsVisible: true,
    };
  },
  props: {
    bgColor: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mounted() {},
  methods: {
    clickOutsideHandler: function (): void {
      this.show = false;
      console.log("Click Outside the thing triggeres");
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
  cursor: grab;
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
</style>
