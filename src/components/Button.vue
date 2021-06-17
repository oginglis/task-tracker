<template>
  <button @click="toggleButton">{{ buttonText }}</button>
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
    toggleButton: function () {
      this.$emit("changeButton", this.buttonText);
    },
  },
};
</script>

<style scoped>
button {
  width: 100px;
  background-color: rgb(192, 29, 29); /* Green */
  border: none;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  height: 50px;
  cursor: pointer;
}

button:hover {
  background-color: rgb(192, 85, 85);
}
</style>
