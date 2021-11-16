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
    <TaskTrackerCreator :style="setCreatorToListHeight()" />
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
      creatorHeight: 0,
    };
  },
  methods: {
    getAllLists: function (): void {
      ListService.getList().then((response): void => {
        this.lists = response.data as Array<ListType>;
      });
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
