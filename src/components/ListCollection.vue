<template>

  <div class="tracker_collection">
    <ul v-for="list in lists" :key="list.id" class="tracker_collection__list">
      <List
        v-if="lists"
        :trackerTitle="list.title"
        :trackerColor="list.backgroundColour"
        :taskTrackerID="list.id"
        :tasks2="checkForTasks(list.todos)"
        @sizingUpdate="setCreatorToListHeight"
        @requestDeleteList="deleteList"

      >
      </List>
    </ul>
    <ListPlaceholder v-if="showNewList" :bgColour="newListBgColor" @createNewListNow="createNewList"/>
    <ListCreator
      :style="creatorDimensionsPixels"
      @createNewList="toggleColorPicker"
      ref="taskCreator"
      v-if="!showColorPicker"
    />
    <ColourSelector
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
import List from "./List.vue";
import { ListType } from "@/types/List";
import ListCreator from "./ListCreator.vue";
import ColourSelector from "./ColourSelector.vue";
import { TrackerDimensions } from "@/types/Dimensions";
import ListPlaceholder from "./ListPlaceholder.vue"
import tinyColor from "tinycolor2";
import colours from '../common/colours';
import { TodoType } from "@/types/Todo";
export default defineComponent({
  name: "ListCollection",
  components: {
    List,
    ListCreator,
    ColourSelector,
    ListPlaceholder
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
      colours: colours,
    };
  },
  watch: {
    creatorDimensionsPixels: function (old, newHeight) {
      this.creatorDimensionsPixels.height = newHeight;
    },
  },
  methods: {

    checkForTasks: function(todos: Array<TodoType> | undefined): Array<TodoType>{
      if (todos == undefined){
  return []
      }
    else {
    todos.sort(({position:a}, {position:b}) => a-b);
    return todos
    }

    },
    handleclickColor: function (payload: string): void {
      this.toggleColorPicker();
      let HSLcol = tinyColor(payload);
      this.newListBgColor = HSLcol.toHslString();
      this.toggleNewList();
    },
    createNewList: function(listinfo: {colour: string, title: string}):void {
      this.showNewList = false;
      if (!listinfo.title){
        return
      }
      let  newList = {
        backgroundColour: listinfo.colour as string,
        width: this.creatorDimensionsNumber.width,
        height: this.creatorDimensionsNumber.height,
        title: listinfo.title as string,
        id: (this.lists.length+1),
      }
      ListService.postList(newList).catch(function (error) {
        console.log(error);
      });
      this.lists = [...this.lists, newList]
    },
    toggleNewList: function():void {
    this.showNewList = !this.showNewList
    },
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
      }).catch(function (error) {
          console.log(error);
        });
    },
    deleteList: function(listID: number): void {
      ListService.deleteList(listID).catch(function (error) {
          console.log(error);
      });
      var index = this.lists.findIndex(function(o){
        return o.id === listID;
      })
      if (index !== -1) this.lists.splice(index, 1);
    },
    toggleColorPicker: function (): void {
      this.showColorPicker = !this.showColorPicker;
    },
    getAbsoluteHeight: function (el: HTMLElement) {
      // Get the DOM Node if you pass in a string
      // el = typeof el === "string" ? document.querySelector(el) : el;
      var styles = window.getComputedStyle(el);
      var margin =
        parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

      return Math.ceil(el.offsetHeight + margin);
    },
    colorPickerDimensions: function (): TrackerDimensions {
      if (this.$refs["taskCreator"]) {
        let taskCreator = this.$refs["taskCreator"] as HTMLElement;

        if (taskCreator) {
          let elementHeight = this.getAbsoluteHeight(taskCreator);
          if (elementHeight < 450) {
            elementHeight = 450;
          }
          return { height: elementHeight, width: this.$el.offsetWidth };
        }
        return { height: 100, width: 2000 };
      } else return { height: 100, width: 2000 };
    },
    setCreatorToListHeight: function (newHeight: number): void {
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
  flex-wrap: wrap;
}
.tracker_collection__list {
  margin: 0;
  padding: 0;
}
</style>
