<template>
  <div :style="calculatedBackgroundColor" class="task-tracker-wrap">
    <!-- <Header :title="`New List`" :headerColour="bgColour"/> -->
    <h1>HELLOW WORD</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Header from "./Header.vue";


import tinyColor from "tinycolor2";
export default defineComponent({
  name: "NewListPlaceholder",
  components: {
    // Header,
  },

  props: ["bgColour"],


  data: function () {
    return {
    backgroundColour: "hsl(33, 52%, 69%)"

    };
  },
  methods: {


  },
  computed: {

    calculatedBackgroundColor: function (): object {
      return {
        backgroundColor: this.bgColour,
      };
    },
    calculatedTextColor: function (): object {
      if (tinyColor(this.bgColour).isLight()) {
        return {
          color: "black",
        };
      } else {
        return {
          color: "white",
        };
      }
    },
  },
});
</script>

<style scoped>

.task-tracker-wrap {
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  width: 300px;
  margin: 0 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;
  min-height: 33rem;
}

</style>
