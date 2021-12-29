<template>
  <div>
    <h1
      contenteditable="true"
      @focus="isFocus = true"
      @blur="updateTitle($event)"
      class="single-line"
      @keydown.enter.prevent="handleEnter($event)"
      :style="[setBGColor(), calculatedTextColor]"
      ref="text"
    >
      {{ headerTitle }}
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import tinyColor from "tinycolor2";
export default defineComponent({
  name: "ListHeader",
  data: function () {
    return {
      headerTitle: "New List",
      isFocus: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "Hello Thered",
    },
    headerColour: {
      type: String,
    },
    startFocused: {
      type: Boolean,
    },
  },
  created(){
    this.isFocus = this.startFocused;
  },
  beforeMount(){
    if(this.title){
 this.headerTitle = this.title;
    }
  },
  mounted(){
    if(this.startFocused){
      this.focusInput()
    }
  },
  computed: {
    calculatedTextColor: function (): object {
      if (tinyColor(this.headerColour).isLight()) {
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
    handleEnter: function (event: Event) {
      event.preventDefault();
      this.$emit("submitList", (event.target as HTMLElement).innerHTML)
    },
    updateTitle: function (e: Event): void {
      this.isFocus = false;
      this.setBGColor();
      this.headerTitle = (e.target as HTMLElement).innerText;
      this.$emit("updateTitle", this.headerTitle);
    },
     focusInput() {
      (this.$refs['text'] as HTMLElement).focus();
      (this.$refs['text'] as HTMLElement).innerText = ""
    }
  },
});
</script>

<style scoped>
h1 {
  font-weight: 500;
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
