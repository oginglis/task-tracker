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
  width: 200px;
  margin-bottom: 20px;
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
</style>
