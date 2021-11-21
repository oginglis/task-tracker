<template>
  <div class="tracker_collection">
    <ul v-for="list in lists" :key="list.id" class="tracker_collection__list">
      <TaskTracker
        v-if="lists"
        :trackerTitle="list.title"
        :trackerColor="list.backgroundColour"
        :taskTrackerID="list.id"
        @sizingUpdate="setCreatorToListHeight()"
      >
      </TaskTracker>
    </ul>
    <TaskTrackerCreator
      :style="setCreatorToListHeight()"
      @createNewList="toggleColorPicker"
      ref="taskCreator"
    />
    <!-- <P5CanvasColours :canvasSize="{ height: 100, width: 2000 }" /> -->
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import ListService from "@/services/ListService";
import TaskTracker from "./TaskTracker.vue";
import { ListType } from "@/types/List";
import TaskTrackerCreator from "./TaskTrackerCreator.vue";
// import P5CanvasColours from "./P5CanvasColours.vue";
import { TrackerDimensions } from "@/types/Dimensions";
export default defineComponent({
  name: "TrackerCollection",
  components: {
    TaskTracker,
    TaskTrackerCreator,
    // P5CanvasColours,
  },
  created() {
    this.getAllLists();
  },
  data: function () {
    return {
      lists: [] as Array<ListType>,
      creatorHeight: 0,
      showColorPicker: false,
    };
  },
  methods: {
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
      });
    },
    toggleColorPicker: function (): void {
      console.log("show colour picker called");
      this.showColorPicker != this.showColorPicker;
    },
    colorPickerDimensions: function (): TrackerDimensions {
      let taskCreator = this.$refs["taskCreator"] as any;
      console.log(Object.entries(this.$refs));
      if (taskCreator) {
        let cs = getComputedStyle(taskCreator);

        let paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        let borderY =
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        // Element width and height minus padding and border

        let elementHeight = taskCreator.offsetHeight - paddingY - borderY;
        if (elementHeight < 450) {
          elementHeight = 450;
        }
        return { height: elementHeight, width: this.$el.offsetWidth };
      }
      return { height: 100, width: 2000 };
    },
    setCreatorToListHeight: function (): void {
      let largestHeight: number = Math.max.apply(
        Math,
        this.lists.map(function (list) {
          return list.height;
        })
      );
      this.creatorHeight = largestHeight;
    },
  },
});
</script>

<style scoped>
.tracker_collection {
  display: flex;
}
.tracker_collection__list {
  margin: 0;
  padding: 0;
}
</style>
