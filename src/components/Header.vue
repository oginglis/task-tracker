<template>
  <div>
    <h1
      contenteditable="true"
      @focus="isFocus = true"
      @blur="updateTitle"
      class="single-line"
      @keydown.enter.prevent="handleEnter($event)"
      :style="setBGColor()"
    >
      {{ title }}
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Header",
  data: function () {
    return {
      headerTitle: "",
      isFocus: false,
    };
  },
  props: {
    title: {
      type: String,
      defult: "Hello Thered",
    },
    headerColour: {
      type: String,
    },
  },
  methods: {
    setBGColor: function () {
      let hslReg: RegExp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g;

      let hsl: string[] = hslReg.exec(this.headerColour!)!.slice(1, 4);
      if (this.isFocus) {
        return {
          backgroundColor: `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 10}%`,
          borderRadius: `10px`,
        };
      } else {
        return {
          backgroundColor: `initial`,
        };
      }
    },
    handleEnter: function (event: any) {
      event.preventDefault();
    },
    updateTitle: function (e: any): void {
      this.isFocus = false;
      this.headerTitle = e.target.innerText;
      this.$emit("updateTitle", this.headerTitle);
    },
  },
});
</script>

<style scoped>
h1 {
  font-weight: initial;
  margin: 0.5rem 0;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
}

[contenteditable]:focus {
  outline: 0px solid transparent;
  cursor: text;
}
[contenteditable="true"].single-line {
  white-space: nowrap;
  width: 18rem;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
}
[contenteditable="true"].single-line br {
  display: none;
}
[contenteditable="true"].single-line * {
  display: inline;
  white-space: nowrap;
}
</style>
