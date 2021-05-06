<template>
    <div>
        <Task />
    </div>
</template>

<script>

import Task from './Task.vue'
export default {
    name: TaskList,
    components: {
        Task,
    },
    props: {
        taskData: Object,
    }
}
</script>