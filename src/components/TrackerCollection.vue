<template>
  <div>
    <ul v-for="list in lists" :key="list.id">
      <TaskTracker
        v-if="lists"
        :trackerTitle="list.title"
        :trackerColor="list.backgroundColour"
        :taskTrackerID="list.id"
      >
      </TaskTracker>
    </ul>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import ListService from "@/services/ListService";
import TaskTracker from "./TaskTracker.vue";
import { ListType } from "@/types/List";

export default defineComponent({
  name: "TrackerCollection",
  components: {
    TaskTracker,
  },
  created() {
    this.getAllLists();
  },
  data: function () {
    return {
      lists: [] as Array<ListType>,
    };
  },
  methods: {
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
      });
    },
  },
});
</script>

<style scoped>
</style>
