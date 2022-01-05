<template>
  <div :style="calculatedBackgroundColor" class="task-tracker-wrap">
    <ListHeader
      v-if="bgColour"
      @updateTitle="anotherHandleHideList"
      @submitList="anotherHandleHideList"
      :title="`New List`"
      :headerColour="bgColour"
      :startFocused="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ListHeader from "./ListHeader.vue";
import tinyColor from "tinycolor2";
export default defineComponent({
  name: "ListCreator",
  components: {
    ListHeader,
  },
  props: {
    bgColour: {
      type: String,
      default: "hsl(33, 52%, 69%)"
    },
  },
  data: function () {
    return {
    backgroundColour: "hsl(33, 52%, 69%)"
    };
  },
  methods: {
    anotherHandleHideList: function(payload: string):void{
      let newListInfo = {
        title: payload,
        colour: this.bgColour
      }
      this.$emit('createNewListNow', newListInfo)
    },
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
  }
});
</script>

<style scoped>
.task-tracker-wrap {
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  width: 340px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 33rem;
}
</style>
