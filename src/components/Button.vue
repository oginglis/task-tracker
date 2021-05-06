<template>
    <button @click="toggleButton">{{buttonText}}</button>
</template>

<script>
export default {
    name: "Button",
    props: {
        buttonText: {
            type: String,
            default: "Add Task"
        }
    },
    methods: {
        toggleButton: function(){
            this.$emit('changeButton', this.buttonText);
        }
    }
}
</script>

<style scoped>
  button {
    width: 100px;
  }
</style>