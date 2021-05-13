<template>
    <div>
        <h1>{{title}}</h1>
        <h2>{{date}}</h2>
    </div>
</template>

<script>


export default {
    name: "Task",
    components: {

    },
    data(){
        return {
            
        }
    },
    props: {
        title: String,
        date: String
    },

}
</script>

<style scoped>

</style>