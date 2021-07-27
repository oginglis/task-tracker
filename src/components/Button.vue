<template>
  <button class="btn" @click="clickButton" :style="buttonBGColour">
    <font-awesome-icon class="btn__plus" icon="plus"></font-awesome-icon>
    {{ buttonText }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add([faPlus] as any);

export default defineComponent({
  name: "Button",
  data: function () {
    return {};
  },
  props: {
    buttonText: {
      type: String,
      default: "Add Task",
    },
    buttonBGColor: {
      type: String,
      default: "hsl(39, 81%, 83%)",
    },
  },
  computed: {
    buttonBGColour: function () {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;
      let hsl: string[] = hslReg.exec(this.buttonBGColor!)!.slice(1, 4);
      return {
        backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
      };
    },
  },
  methods: {
    clickButton: function () {
      this.$emit("clickButton", this.buttonText);
    },
  },
});
</script>

<style scoped>
.btn {
  padding: 10px;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}

.btn__plus {
  margin-right: 5px;
}

.btn--red {
  background-color: rgb(192, 29, 29);
  color: white;
  font-size: 16px;
}

.btn:hover {
  background-color: rgb(192, 85, 85);
}
</style>
