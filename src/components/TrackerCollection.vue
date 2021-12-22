<template>
  <div class="tracker_collection">
    <ul v-for="list in lists" :key="list.id" class="tracker_collection__list">
      <TaskTracker
        v-if="lists"
        :trackerTitle="list.title"
        :trackerColor="list.backgroundColour"
        :taskTrackerID="list.id"
        @sizingUpdate="setCreatorToListHeight"
      >
      </TaskTracker>
    </ul>
    <NewListPlaceholder v-if="showNewList" :bgColour="newListBgColor" @createNewListNow="createNewList"/>
    <TaskTrackerCreator
      :style="creatorDimensionsPixels"
      @createNewList="toggleColorPicker"
      ref="taskCreator"
      v-if="!showColorPicker"
    />
    <P5CanvasColours
      v-else
      :canvasSize="creatorDimensionsNumber"
      :ballColours="colours"
      :title="`Choose a colour for new list`"
      :bgColor="`hsl(0, 0%, 96%)`"
      :textColor="{ color: `hsl(0, 0%, 0%)` }"
      @clickColor="handleclickColor"
    />
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import ListService from "@/services/ListService";
import TaskTracker from "./TaskTracker.vue";
import { ListType } from "@/types/List";
import TaskTrackerCreator from "./TaskTrackerCreator.vue";
import P5CanvasColours from "./P5CanvasColours.vue";
import { TrackerDimensions } from "@/types/Dimensions";
import NewListPlaceholder from "./NewListPlaceholder.vue"
import tinyColor from "tinycolor2";
export default defineComponent({
  name: "TrackerCollection",
  components: {
    TaskTracker,
    TaskTrackerCreator,
    P5CanvasColours,
    NewListPlaceholder
  },
  created() {
    this.getAllLists();
  },
  data: function () {
    return {
      lists: [] as Array<ListType>,
      creatorDimensionsNumber: { width: 304, height: 528 },
      creatorDimensionsPixels: { width: "304px", height: "528px" },
      showColorPicker: false,
showNewList: false,
newListBgColor: "hsl(33, 52%, 69%)",
      colours: [
        { colour: "hsl(39, 81%, 73%)", active: true },
        { colour: "hsl(13, 80%, 48%)", active: false },
        { colour: "hsl(341, 67%, 47%)", active: false },
        { colour: "hsl(75, 56%, 38%)", active: false },
        { colour: "hsl(10, 30%, 62%)", active: false },
        { colour: "hsl(0, 0%, 100%)", active: false },
        { colour: "hsl(319, 57%, 39%)", active: false },
        { colour: "hsl(2, 73%, 43%)", active: false },
        { colour: "hsl(207, 15%, 12%)", active: false },
        { colour: "hsl(196, 44%, 51%)", active: false },
        { colour: "hsl(12, 73%, 51%)", active: false },
        { colour: "hsl(164, 35%, 52%)", active: false },
        { colour: "hsl(31, 80%, 54%)", active: false },
        { colour: "hsl(205, 80%, 40%)", active: false },
        { colour: "hsl(41, 62%, 51%)", active: false },
        { colour: "hsl(186, 56%, 42%)", active: false },
        { colour: "hsl(195, 23%, 27%)", active: false },
        { colour: "hsl(316, 38%, 58%)", active: false },
        { colour: "hsl(207, 15%, 12%)", active: false },
        { colour: "hsl(212, 73%, 36%)", active: false },
      ],
    };
  },
  watch: {
    creatorDimensionsPixels: function (old, newHeight) {
      console.log("Picker Size Changed from ", old, " to ", newHeight);
      this.creatorDimensionsPixels.height = newHeight;
    },
  },
  methods: {

    handleclickColor: function (payload: any): void {
      this.toggleColorPicker();
      console.log(payload);
      // convert payload to HSL
      console.log("payload", payload)
      let HSLcol = tinyColor(payload);

      this.newListBgColor = HSLcol.toHslString();
      this.toggleNewList();

    },
    createNewList: function(listinfo: any):void {

      this.showNewList = false;
      if (!listinfo.title){
return
      }
      console.log("Create new list called", listinfo)
      let  newList = {
        backgroundColour: listinfo.colour as string,
        width: this.creatorDimensionsNumber.width,
        height: this.creatorDimensionsNumber.height,
        title: listinfo.title as string,
        id: (this.lists.length+1),
      }
      ListService.postList(newList);

      this.lists = [...this.lists, newList]

    },
    toggleNewList: function():void {
    this.showNewList = !this.showNewList
    },
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
      });
    },
    toggleColorPicker: function (): void {
      this.showColorPicker = !this.showColorPicker;
    },
    getAbsoluteHeight: function (el: any) {
      // Get the DOM Node if you pass in a string
      // el = typeof el === "string" ? document.querySelector(el) : el;


      var styles = window.getComputedStyle(el);
      var margin =
        parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

      return Math.ceil(el.offsetHeight + margin);
    },
    colorPickerDimensions: function (): TrackerDimensions {
      if (this.$refs["taskCreator"]) {
        let taskCreator = this.$refs["taskCreator"] as any;
        console.log("this.$refs ", this.$refs);
        console.log("Task Creator Ref : ", taskCreator.ownKeys);
        if (taskCreator) {
          // let cs = getComputedStyle(taskDisplay);

          // let paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

          // let borderY =
          //   parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

          // Element width and height minus padding and border

          let elementHeight = this.getAbsoluteHeight(taskCreator);
          if (elementHeight < 450) {
            elementHeight = 450;
          }

          return { height: elementHeight, width: this.$el.offsetWidth };
        }
        return { height: 100, width: 2000 };
      } else return { height: 100, width: 2000 };
    },
    setCreatorToListHeight: function (newHeight: any): void {
      console.log("The height sent to Track collection ", newHeight);
      this.getAllLists();
      let largestHeight: number = Math.max.apply(
        Math,
        this.lists.map(function (list) {
          return list.height;
        })
      );
      let largestWidth: number = Math.max.apply(
        Math,
        this.lists.map(function (list) {
          return list.width;
        })
      );
      largestHeight;
      this.creatorDimensionsNumber.height = newHeight;
      this.creatorDimensionsNumber.width = largestWidth;
      this.creatorDimensionsPixels.height = newHeight + "px";
      this.creatorDimensionsPixels.width = largestWidth + "px";
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
