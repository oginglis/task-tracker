<template>
  <font-awesome-icon
    @click="clicked"
    :icon="type"
    :style="[styleIcon]"
    size="6x"
    class="icon"
    ><span class="tooltiptext">Tooltip text</span></font-awesome-icon
  >
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
  name: "Icon",
  data: function () {
    return {};
  },
  props: {
    type: String,
    bgColor: {
      type: String,
      default: null,
    },
    width: String,
    height: String,
    borderStyles: Boolean,
    fontSize: {
      default: "1em",
      type: String,
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
      if (this.borderStyles) {
        return {
          backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${
            parseInt(hsl[2]) + 20
          }%)`,
          border: `0.4rem solid hsl(${hsl[0]},${hsl[1]}%,${
            parseInt(hsl[2]) + 10
          }% )`,
          "--color-hover": `hsl(${hsl[0]},${hsl[1]}%,${
            parseInt(hsl[2]) + 45
          }%)`,
          width: this.width,
          height: this.height,
        };
      } else {
        return {};
      }
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
  padding: 0.3rem;
  transition: transform 0.05s cubic-bezier(0.36, 0.75, 0.67, 1.46);
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

.icon:hover .tooltiptext {
  visibility: visible;
}
.icon .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}
</style>
