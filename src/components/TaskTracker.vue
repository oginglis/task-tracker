<template>
    <div class="task-tracker-wrap">
        <Header title="Task Tracker"/>
        <Button buttonText="Add Task"/>
        <TaskInput />
    </div>
</template>

<script>
import Header from './Header.vue'
import Button from './Button.vue'
import TaskInput from './TaskInput.vue'
export default {
    name: 'TaskTracker',
    components: {
        Header,
        Button,
        TaskInput
    }
}
</script>

<style scoped>

</style>