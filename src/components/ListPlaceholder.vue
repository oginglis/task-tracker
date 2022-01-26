<template>
  <div class="list_creator">
    <Tooltip position="bottom" :tooltipText="'Create new list'">
      <Icon @iconClicked="createAList" :type="`plus`" class="hiding__icon black_icon plusicon"/>
    </Tooltip>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import { ListType } from "@/types/List";
import Tooltip from "../common/components/Tooltip.vue";
import PlusIcon from "@/assets/plus.svg";
import Icon from "../common/components/Icon.vue";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add([faPlus] as any);

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
  background-color: var(--placeholder-color);
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

  font-size: 300px;
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
