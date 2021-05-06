<template>
    <button>{{buttonText}}</button>
</template>

<script>
export default {
    name: "Button",
    props: {
        buttonText: {
            type: String,
            default: "Add Task"
        }
    }
}
</script>

<style scoped>
  button {
    width: 100px;
  }
</style>