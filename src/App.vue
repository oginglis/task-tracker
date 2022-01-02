<template>

    <metainfo>
      <template v-slot:title="{ content }">{{
        content ? `${content}  · Schedule` : `Task Tracker`
      }}</template>
    </metainfo>
    <Homepage  />

</template>


<script lang="ts">
import { defineComponent } from "vue";
import Homepage from "./views/Homepage.vue";
import { useMeta } from "vue-meta";
export default defineComponent({
  name: "App",
  components: {
    Homepage,
  },
  mounted(){
console.log(`
                    ___           ___                                     
      ___          /  /\\         /  /\\       ___         ___              
     /__/\\        /  /:/        /  /:/      /__/\\       /  /\\             
     \\  \\:\\      /  /:/        /  /:/       \\__\\:\\     /  /::\\            
      \\__\\:\\    /  /:/        /  /:/        /  /::\\   /  /:/\\:\\           
      /  /::\\  /__/:/     /\\ /__/:/      __/  /:/\\/  /  /::\\ \\:\\          
     /  /:/\\:\\ \\  \\:\\    /:/ \\  \\:\\     /__/\\/:/~~  /__/:/\\:\\_\\:\\         
    /  /:/__\\/  \\  \\:\\  /:/   \\  \\:\\    \\  \\::/     \\__\\/  \\:\\/:/         
   /__/:/        \\  \\:\\/:/     \\  \\:\\    \\  \\:\\          \\  \\::/          
   \\__\\/          \\  \\::/       \\  \\:\\    \\__\\/           \\__\\/           
                   \\__\\/         \\__\\/                                    
`)
  },
  setup() {
    useMeta({
      title: "Actions",
      htmlAttrs: { lang: "en", amp: true },
    });
  },
});



</script>

<style>
@import url("https://use.typekit.net/saf3ibf.css");

#app {
  font-family: aktiv-grotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f4f4f4;
  min-height: 100vh;
  min-width: 100vw;
}

body{
  margin:0;
}
</style>
