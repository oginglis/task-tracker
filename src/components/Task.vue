<template>
    <div class="task-wrapper" :class="{reminder: isTrueSet}">
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
        date: String,
        reminder: {
          type: String,
          default: "false"
        }
    },
    computed: {
      isTrueSet: function(){
        if(this.reminder == 'true'){
          return true
        } else {
          return false
        }
      }
    }

}
</script>

<style scoped>

.task-wrapper{
  width: 500px;
  margin: 0 auto;
}
.reminder{
  border-left: 10px solid green ;
}
</style>
