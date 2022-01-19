<template >
<div class="app" :class="{transitionColour: !isLoading}">
    <metainfo>
      <template v-slot:title="{ content }">{{
        content ? `${content}  · Schedule` : `Task Tracker`
      }}</template>
    </metainfo>
    <Homepage />
</div>
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
  methods: {
    addAnimation: function():Object {
      return {
        transition: `background-color 1s ease`
      }
    },
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
      title: "Steps",
      htmlAttrs: { lang: "en", amp: true },
    });
  },
});



</script>

<style>


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
  font-family: MonumentGrotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.app {
  color: var(--text-color);
  background-color: var(--background-color);
  min-height: 100vh;
  width: 100vw;
}

body{
  margin:0;
}

.transitionColour {
transition: background-color 500ms;
}

.preload * {
  transition: none !important;
 -webkit-transition: none !important;
 -moz-transition: none !important;
 -ms-transition: none !important;
 -o-transition: none !important;
}
</style>
