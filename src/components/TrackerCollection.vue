<template>
  <div class="tracker_collection">
    <ul v-for="list in lists" :key="list.id">
      <TaskTracker
        v-if="lists"
        :trackerTitle="list.title"
        :trackerColor="list.backgroundColour"
        :taskTrackerID="list.id"
      >
      </TaskTracker>
    </ul>
    <TaskTrackerCreator />
  </div>
</template>

<script  lang="ts">
import { defineComponent } from "vue";
import ListService from "@/services/ListService";
import TaskTracker from "./TaskTracker.vue";
import { ListType } from "@/types/List";
import TaskTrackerCreator from "./TaskTrackerCreator.vue";

export default defineComponent({
  name: "TrackerCollection",
  components: {
    TaskTracker,
    TaskTrackerCreator,
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
.tracker_collection {
  display: flex;
}
</style>
