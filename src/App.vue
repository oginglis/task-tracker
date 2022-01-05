<template >

    <metainfo>
      <template v-slot:title="{ content }">{{
        content ? `${content}  · Schedule` : `Task Tracker`
      }}</template>
    </metainfo>
    <Homepage />

</template>


<script lang="ts">
import { defineComponent } from "vue";
import Homepage from "./views/Homepage.vue";
import { useMeta } from "vue-meta";
export default defineComponent({
  name: "App",
  data: function (){
    return {
      isLoading: true,
    }
  },
  components: {
    Homepage,
  },
  mounted(){
    this.isLoading = false;
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

:root {
    --background-color: hsl(0, 0%, 96%);
    --text-color: black;  
    --section-divide-color: hsl(0, 0%, 92%);
}

[data-theme="darkMode"] {
    --background-color: hsl(216, 9%, 10%);
    --text-color: white;   
    --section-divide-color: black;
}

#app {
  font-family: aktiv-grotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  background-color: var(--background-color);
  min-height: 100vh;
  min-width: 100vw;
  transition: background-color 500ms;
}

body{
  margin:0;
}

.preload * {
  transition: none !important;
 -webkit-transition: none !important;
 -moz-transition: none !important;
 -ms-transition: none !important;
 -o-transition: none !important;
}
</style>
