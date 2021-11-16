<template>
  <div class="list_creator">
    <Tooltip position="bottom" :tooltipText="'Create new list'">
      <ClickableIcon
        type="plus"
        :bgColor="`hsl(0, 0%, 90%)`"
        class="hiding__icon"
        :borderStyles="false"
        @iconClicked="createAList"
      />
    </Tooltip>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import { ListType } from "@/types/List";
import Tooltip from "./Tooltip.vue";
import ClickableIcon from "./ClickableIcon.vue";

export default defineComponent({
  name: "ListCreator",
  components: {
    Tooltip,
    ClickableIcon,
  },
  created() {},
  data: function () {
    return {
      lists: [] as Array<ListType>,
    };
  },
  methods: {
    createAList: function (): void {
      console.log("create a list clicked");
    },
  },
});
</script>

<style scoped>
.list_creator {
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  background-color: white;
  width: 300px;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;
  min-height: 33rem;
  justify-content: center;
}

.hiding__icon {
  font-size: 19em;
}
</style>
