<template>  
  <NavBar v-model:themeColor="theme" @updateTheme="themeUpdate"/>
  <div class="section_wrap">
    <section class="schedule_section">
      <h1 class="collection_title right_align">Schedule</h1>
      <Schedule :tasks="extractAllTasks"/>
    </section> 
    <section class="list_section">
      <h1 class="collection_title">Lists</h1>
      <ListCollection @askToCreateNewList2="createNewList" @askToDeleteList2="deleteList" v-model:lists="lists" @updateListTitle="updateListTitleNow" @askToUpdateListColour3="updateListColourNow" @askToUpdateDimensions3="updateListDimensionsNow"/>
    </section> 
  </div>
</template>

<script  lang="ts">

import ListCollection from "../components/ListCollection.vue";
import NavBar from "../common/components/NavBar.vue"
import { defineComponent } from "vue";
import Schedule from "../components/Schedule.vue";
import { ListType } from "@/types/List";
import { TodoType } from "@/types/Todo";
import ListService from '../services/ListService';

export default defineComponent({
  name: "Homepage",
  components: {
    NavBar,
    ListCollection,
    Schedule
  },
  beforeMount(){
    if(localStorage.getItem('theme')){
      let localTheme: string = localStorage.getItem('theme') as string; //gets stored theme value if any
      document.documentElement.setAttribute('data-theme', localTheme);
    }

  },
  methods: {
      updateListDimensionsNow: function (listId: number, dimensions: {width: number, height: number}):void {
        let {width, height} = dimensions;
      let listToUpdateDimensionsOf = this.lists.find(list => list.id === listId);
      if (listToUpdateDimensionsOf !== undefined){
        listToUpdateDimensionsOf.width = width;
        listToUpdateDimensionsOf.height = height;
      }
    },
    updateListColourNow: function (listId: number, newColor: string):void {
      let listToUpdateColourOf = this.lists.find(list => list.id === listId);
      if (listToUpdateColourOf !== undefined){
        listToUpdateColourOf.backgroundColour = newColor;
      }
    },
    updateListTitleNow: function ( listId: number, newTitle: string):void {
      let listToUpdateTitleOf = this.lists.find(list => list.id === listId);
      if (listToUpdateTitleOf !== undefined){
        listToUpdateTitleOf.title = newTitle;
      }
    },
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
        }).catch(function (error) {
      console.log(error);
    });
    },
    themeUpdate: function(payload: string):void {
      this.theme = payload;
    },
    generateRandomId: function(): number {
       let min = Math.ceil(0);
      let max = Math.floor(10000);
      let rdm = 2;
      let idArray: Array<number> = [];
      this.lists.forEach((list)=> {
        idArray.push(list.id)
      });
      rdm = Math.floor(Math.random() * (max - min) + min);
      while (idArray.includes(rdm)){
        console.log("Id Matched...Making new ID")
        rdm = Math.floor(Math.random() * (max - min) + min);
      }

      return rdm
    },
    createNewList: function(listinfo: {colour: string, title: string}):void {
      if (!listinfo.title){
        return
      }
      let  newList = {
        backgroundColour: listinfo.colour as string,
        width: 500,
        height: 500,
        title: listinfo.title as string,
        id: this.generateRandomId(),
      };
      console.log("Creating a new list with", newList)
      ListService.postList(newList).catch(function (error) {
        console.log(error);
      });
      this.lists = [...this.lists, newList]
    },
    deleteList: function(listID: number): void {
      console.log("asking to delete list with ID ", listID );
    ListService.deleteList(listID).then(()=>{

    }).catch(function (error) {
        console.log(error);
    });
    var index = this.lists.findIndex(function(o){
      return o.id === listID;
    })
    console.log("index to detlee ", index)
    if (index !== -1) this.lists.splice(index, 1);
  },
  },
  computed: {
    extractAllTasks: function(): Array<TodoType> {
      let taskArray: Array<TodoType> = [];
      this.lists.forEach((list)=> {
        if (list.todos === undefined) {
          return;
        }
        list.todos.forEach((task)=> {
          taskArray.push(task);
        })
      })
      return taskArray    
    }
  },
  created() {
    this.getAllLists();
  },
  data: function () {
    return {
      theme: '',
      lists: [] as Array<ListType>,
    };
  },

  }
);
</script>

<style scoped>

.collection_title{
  text-align: left;
  color: var( --text-color);
  font-size: 30px;
  font-weight: 700;
  line-height: 1.25;
  user-select: none;
}

.section_wrap{
  display: flex;
  padding-left: 1rem;
  min-height: inherit;
  height: calc(100vh - 40px);
}
.list_section{
  flex-grow: 3;
  padding-left: 3rem;
 flex-basis: 70vw;
   height: calc(100vh - 40px);
  overflow: scroll;
}


.schedule_section{
  flex-grow: 1;
  border-right: solid 2px var(--section-divide-color);
  transition: border-right 500ms;
  flex-basis: 400px;
  min-width: 300px;
  height: calc(100vh - 40px);
  overflow: scroll;

}


.right_align{ 
  text-align: right;
  margin-right: 2rem;
}


</style>
