<template>
  <div v-show="isOpen" class="modal-wrapper center" :style="style">
    <h3>{{ task }}</h3>
    <p>{{ date }}</p>
  </div>
</template>

<script>
export default {
  name: "EditModal",
  data: function () {
    return {};
  },
  props: {
    isOpen: {
      default: false,
      type: Boolean,
    },
    task: {
      default: " This is a task to tesk",
      type: String,
    },
    date: {
      default: "20-July 101",
      type: String,
    },
    taskColor: {
      type: Array,
    },
  },
  methods: {
    toggleOpenModal: function () {
      this.isOpen == true;
    },
    style: function () {
      return `background-image: linear-gradient(${this.taskColor[0]}, ${this.taskColor[1]}); background-size: cover; `;
    },
  },
  computed: {},
};
</script>

<style scoped>
.modal-wrapper {
  height: 40vh;
  width: 40vw;
  z-index: 1;
  background-color: pink;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
