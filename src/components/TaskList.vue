<template>
    <div>
        <Task v-for="task in info" :title="task.title" :date="task.date" :reminder="task.reminder" :key="task.id"/>
    </div>
</template>

<script>

import Task from './Task.vue'
import axios from 'axios'
export default {
    name: "TaskList",
    components: {
        Task,
    },
    data(){
        return {
            info: null,
        }
    },
    props: {
        taskData: Object,
    },
    mounted(){
        axios
        .get('http://localhost:3000/tasks')
        .then(response => (this.info = response.data));

    }
}
</script>
