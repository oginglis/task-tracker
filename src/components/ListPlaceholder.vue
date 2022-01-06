<template>
  <div class="list_creator">
    <Tooltip position="bottom" :tooltipText="'Create new list'">
    <img :src="plusIcon" alt="my-logo" />
      <Icon
        type="plus"
        :bgColor="`hsl(0, 0%, 90%)`"
        class="hiding__icon black_icon"
        :borderStyles="false"
        @iconClicked="createAList"
      />
    </Tooltip>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import { ListType } from "@/types/List";
import Tooltip from "../common/components/Tooltip.vue";
import Icon from "../common/components/Icon.vue";
import PlusIcon from "@/assets/plus.svg";

export default defineComponent({
  name: "ListPlaceholder",
  components: {
    Tooltip,
    Icon
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

.hiding__icon {
  font-size: 19em;
}

.black_icon{
  color: black;
}

.list_creator:hover .hiding__icon{
  animation: overshoot .3s ease;
}

@keyframes overshoot {
  0% { transform: scale(1) }
  50% { transform: scale(1.8) }
80%{transform: scale(.8) }

  100% { transform: scale(1) }
}
</style>
