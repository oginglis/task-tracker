<template>
    <div class="task-tracker-wrap">
        <Header title="Task Tracker"/>
        <Button @changeButton="changeTheButton" :buttonText="submitButtonText"/>
        <TaskInput v-show="submitButtonText !== 'Add Task'"/>
        <TaskList />
    </div>
</template>

<script>
import Header from './Header.vue'
import Button from './Button.vue'
import TaskInput from './TaskInput.vue'
import TaskList from './TaskList.vue'

export default {
    name: 'TaskTracker',
    components: {
        Header,
        Button,
        TaskInput,
        TaskList
    },
    data: function(){
        return {
            submitButtonText: "Add Task"
        }
    },
    methods: {
        changeTheButton: function(){
            this.submitButtonText == "Add Task" ? this.submitButtonText = "Hide Task Adder" : this.submitButtonText =  "Add Task";
        }
    }
}
</script>

<style scoped>

</style>