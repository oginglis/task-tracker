<template>
    <div>
        <form action="POST">
            <input class="v-spacer" type="text" name="task-info" id="task-input" placeholder="Write the task here">
            <label class="v-spacer" for="birthdaytime">Birthday (date and time):</label>
            <input class="v-spacer" type="datetime-local" id="birthdaytime" name="birthdaytime">
            <label for="reminder">Set Reminder?</label>
            <input v-model="checked" type="checkbox" id="checkbox">
            <button class="v-spacer" type="submit">Save Task</button>
        </form>
    </div>
</template>
<script>
export default {
    name: "TaskInput",
    data: function(){
        return {
            checked: false,
        }
    },

}
</script>

<style scoped>
#task-input{
    display: inline;
    width: 100%;
}
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
    align-items: center;
    background-color: lightblue;
    margin: 0 auto;
}

.v-spacer{
    margin: 5px;
}
</style>