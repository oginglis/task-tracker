<template>
    <div>
        <form action="POST">
            <input type="text" name="task-info" id="" placeholder="Write the task here">
            <label for="birthdaytime">Birthday (date and time):</label>
            <input type="datetime-local" id="birthdaytime" name="birthdaytime">
            <button type="submit">Add Task</button>
        </form>
    </div>
</template>
<script>
export default {
    name: "TaskInput"
}
</script>

<style scoped>

</style>