<template>
  <div class="list_creator">
    <Tooltip position="bottom" :tooltipText="'Create new list'">
    <img :src="plusIcon" alt="my-logo"  class="hiding__icon black_icon plusicon"
        :borderStyles="false"
        @click="createAList"/>
    </Tooltip>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import { ListType } from "@/types/List";
import Tooltip from "../common/components/Tooltip.vue";
import PlusIcon from "@/assets/plus.svg";

export default defineComponent({
  name: "ListPlaceholder",
  components: {
    Tooltip
  },
  created() {},
  data: function () {
    return {
      lists: [] as Array<ListType>,
      plusIcon: PlusIcon
    };
  },
  methods: {
    createAList: function (): void {
      console.log("Clickde a list cliked")
      this.$emit("createNewList");
    },
  },
});
</script>

<style scoped>
.list_creator {
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  background-color: white;
  flex-basis: 340px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}


.list_creator:hover {
  cursor: pointer;
}

.black_icon{
  color: pink;
  height: 6rem;
  animation: transform 1s ease;
}

.black_icon:hover{

  cursor: pointer;
}

.list_creator:hover .hiding__icon{
  transform: scale(1.5); 
  animation: transform 1s ease;
}


</style>
