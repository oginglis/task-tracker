<template>
  <div id="canvas" ref="canva" class="flexcanvas"></div>
</template>

<script lang="ts">
import P5 from "p5";
import { defineComponent, PropType } from "vue";
import { TrackerDimensions } from "../types/Dimensions";
import tinyColor from "tinycolor2";
import { Color } from "../types/Color";

export default defineComponent({
  name: "P5Canvas",
  data: function () {
    return {
      test: "",
    };
  },
  props: {
    canvasSize: {
      type: Object as PropType<TrackerDimensions>,
    },
    bgColor: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },

    title: {
      type: String,
      default: "Task Tracker",
    },
    textColor: {
      type: Object,
    },
  },
  methods: {
    hslTorbg: function (hsl: any): string {
      let col = tinyColor(hsl);
      return col.toRgbString();
    },
  },
  mounted() {
    this.test = this.title;
  },
  unmounted() {},
});
</script>


<style scoped>
</style>
