<template>
  <font-awesome-icon
    @click="clicked"
    :icon="type"
    :style="styleIcon"
    class="icon"
  ></font-awesome-icon>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faCheck,
  faBell,
  faPlus,
  faTrash,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
library.add([faTimes, faCheck, faBell, faPlus, faTrash, faPalette] as any);

export default defineComponent({
  name: "ClickableIcon",
  data: function () {
    return {};
  },
  props: {
    type: String,
    bgColor: {
      type: String,
      default: null,
    },
  },
  methods: {
    clicked: function (): void {
      this.$emit("iconClicked");
    },
  },
  computed: {
    styleIcon: function (): object {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.bgColor!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 20}%)`,
        border: `0.4rem solid hsl(${hsl[0]},${hsl[1]}%,${
          parseInt(hsl[2]) + 10
        }% )`,
        "--color-hover": `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 45}%)`,
      };
    },
  },
});
</script>

<style  scoped>
.icon {
  /* display: none; */
  width: 0.9rem;
  height: 0.9rem;
  margin: 0px;
  border-radius: 50%;
  transition: transform 0.1s cubic-bezier(0.36, 0.75, 0.67, 1.46);
}
.icon--hidden {
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
}
.icon:hover {
  cursor: pointer;
}

.icon:hover {
  transform: scale(1.3);
  background-color: var(--color-hover);
}
</style>
