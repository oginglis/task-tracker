<template>
  <button class="btn btn--red" @click="clickButton">{{ buttonText }}</button>
</template>

<script>
export default {
  name: "Button",
  props: {
    buttonText: {
      type: String,
      default: "Add Task",
    },
  },
  methods: {
    clickButton: function () {
      this.$emit("clickButton", this.buttonText);
    },
  },
};
</script>

<style scoped>
.btn {
  width: 100px;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  height: 50px;
  cursor: pointer;
}

.btn--red {
  background-color: rgb(192, 29, 29);
  color: white;
  font-size: 16px;
}

.btn:hover {
  background-color: rgb(192, 85, 85);
}
</style>
