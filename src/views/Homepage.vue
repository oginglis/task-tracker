<template>  
  <nav class="navigation">
    <Icon
      type="list"
      class="icon icon--hide"
      :bgColor="`hsl(0, 0%, 0%)`"
      :width="`0.9rem`"
      :height="`0.9rem`"
      :borderStyles="true"
    />
  </nav>
  <div class="section_wrap">
    <section class="schedule_section">
      <h1 class="collection_title right_align">Schedule</h1>
      
    </section> 
    <section class="list_section">
      <h1 class="collection_title">Lists</h1>
      <ListCollection />
    </section> 
  </div>
</template>

<script  lang="ts">

import ListCollection from "../components/ListCollection.vue";
import { defineComponent } from "vue";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Icon from "../common/components/Icon.vue";
library.add([faList] as any);
export default defineComponent({
  name: "Homepage",
  components: {
    // VueNavigationBar,
    ListCollection,
    Icon
  },
  created() {},
  data: function () {
    return {};
  },
  methods: {},
});
</script>

<style scoped>

.collection_title{
  text-align: left;
  color: black;
      font-size: 30px;
    font-weight: 700;
    line-height: 1.25;
}

.section_wrap{
  display: flex;
  padding-left: 1rem;
}
.list_section{
  flex-grow: 3;
  padding-left: 3rem;
}

.navigation{
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: rgb(0, 0, 0);
  height: 40px;
}
.schedule_section{
  flex-grow: 1;
  border-right: solid 3px hsl(0, 0%, 92%);
flex-basis: 300px;

}

.icon{ 
  color: white;
}
.right_align{ 
  text-align: right;
  margin-right: 2rem;
}
</style>
