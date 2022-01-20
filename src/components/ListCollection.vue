<template>
  <div class="tracker_collection">
    <ul class="tracker_collection__list">
      <template v-if="lists.length >= 0">
        <List
          v-for="(list)  in lists"
          :list="list"
          :tasks="checkForTasks(list.todos)"
          :key="list.id"
          @sizingUpdate="setCreatorToListHeight"
          @requestDeleteList="askToDeleteList"
          @askToUpdateListTitle="askToUpdateListTitle2"
          @askToUpdateListColour="askToUpdateListColour2"
          @askToUpdateListDimensions="askToUpdateListDimensions2"
        >
        </List>
      </template>
      <template v-if="showNewList">
        <li> 
          <ListCreator :bgColour="newListBgColor" @createNewListNow="askToCreateNewList"/>
        </li>
      </template>
      <template v-if="!showColorPicker">
        <li >
        <ListPlaceholder
          :style="creatorDimensionsPixels"
          @createNewList="toggleColorPicker"
          ref="taskCreator"
        />
        </li>
      </template>
      <template v-else>
        <li>
          <ColourSelector
            :canvasSize="creatorDimensionsNumber"
            :title="`Choose a colour for new list`"
            :bgColor="`hsl(0, 0%, 96%)`"
            :textColor="{ color: `hsl(0, 0%, 0%)` }"
            @clickColor="handleclickColor"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script  lang="ts">
import { defineComponent, PropType } from "vue";
import List from "./List.vue";
import { ListType } from "@/types/List";
import ListPlaceholder from "./ListPlaceholder.vue";
import ColourSelector from "./ColourSelector.vue";
import { TodoType } from "@/types/Todo";
import { TrackerDimensions } from "@/types/Dimensions";
import ListCreator from "./ListCreator.vue"
import tinyColor from "tinycolor2";
export default defineComponent({
  name: "ListCollection",
  components: {
    List,
    ListPlaceholder,
    ColourSelector,
    ListCreator
  },
  props: {
     lists: {type: Array as PropType<Array<ListType>>,default: ()=>[  {
      "backgroundColour": "hsl(2, 73%, 43%)",
      "width": 340,
      "height": 576,
      "title": "Things to do",
      "id": 1}]}
  },

  data: function () {
    return {
      creatorDimensionsNumber: { width: 304, height: 528 },
      creatorDimensionsPixels: { width: "304px", height: "528px" },
      showColorPicker: false,
      showNewList: false,
      newListBgColor: "hsl(33, 52%, 69%)"
    };
  },

  watch: {
    creatorDimensionsPixels: function (old, newHeight) {
      this.creatorDimensionsPixels.height = newHeight;
    },
  },
  methods: {
askToUpdateListDimensions2: function (listId: number, dimensions: {width: number, height: number}):void {
  this.$emit("askToUpdateDimensions3", listId, dimensions)
},
    
    askToUpdateListColour2: function(listId: number,newColor: string): void {
      this.$emit("askToUpdateListColour3", listId, newColor)
    },
    askToUpdateListTitle2: function( listId: number, newTitle: string): void {
      this.$emit("updateListTitle", listId, newTitle)
    },
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
    askToCreateNewList: function(listinfo: {colour: string, title: string}):void {
      this.showNewList = false;
      this.$emit("askToCreateNewList2", listinfo)
    },

    toggleNewList: function():void {
    this.showNewList = !this.showNewList
    },
    askToDeleteList: function(listID: number): void {
       console.log("Second delte with ", listID);
      this.$emit("askToDeleteList2", listID)
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
  margin: 1rem;
  padding: 0;
   display: flex;
  flex-wrap: wrap;
}

.tracker_collection__list li {
  margin: 4px 4px;
}

ul {
  list-style-type: none;
}
</style>
