<template>
  <div class="dots__wrapper">
    <span
      v-for="(item, index) in colours"
      :key="index"
      class="dot"
      :class="{ dot__active: item.active }"
      @click="emitColour(item)"
      :style="{ backgroundColor: item.colour }"
    ></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ColourSelector",

  data: function () {
    return {
      colours: [
        { colour: "hsl(39, 81%, 73%)", active: true },
        { colour: "hsl(41, 51%, 53%)", active: false },
        { colour: "hsl(31, 65%, 55%)", active: false },
        { colour: "hsl(13, 64%, 47%)", active: false },
        { colour: "hsl(4, 63%, 41%)", active: false },
        { colour: "hsl(350, 66%, 33%)", active: false },
        { colour: "hsl(11, 24%, 59%)", active: false },
        { colour: "hsl(344, 59%, 43%)", active: false },
        { colour: "hsl(313, 29%, 56%)", active: false },
      ],
    };
  },
  methods: {
    emitColour: function (dot: any) {
      this.colours.forEach((item) => {
        item.active = false;
      });
      dot.active = true;
      this.$emit("changeColour", dot.colour);
    },
  },
});
</script>

<style  scoped>
.dot {
  height: 25px;
  width: 25px;

  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
}

.dot__active {
  border: 0.2rem white solid;
}
.dot:hover {
  cursor: pointer;
}
.dot:active {
  background-color: white;
}
.dots__wrapper {
  display: flex;
  width: 100%;
  margin: 0.5rem 0rem 0rem 0rem;
  justify-content: space-between;
}
</style>
