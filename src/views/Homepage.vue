<template>  
  <NavBar v-model:themeColor="theme" @updateTheme="themeUpdate"/>
  <div class="section_wrap">
    <section class="schedule_section">
      <h1 class="collection_title right_align">Schedule</h1>
      <Schedule />
    </section> 
    <section class="list_section">
      <h1 class="collection_title">Lists</h1>
      <ListCollection />
    </section> 
  </div>
</template>

<script  lang="ts">

import ListCollection from "../components/ListCollection.vue";
import NavBar from "../common/components/NavBar.vue"
import { defineComponent } from "vue";
import Schedule from "../components/Schedule.vue";
import { ListType } from "@/types/List";
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
    themeUpdate: function(payload: string):void {
      this.theme = payload;
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
        id: (this.lists.length+1),
      }
      ListService.postList(newList).catch(function (error) {
        console.log(error);
      });
      this.lists = [...this.lists, newList]
    },
  },
  created() {},
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
