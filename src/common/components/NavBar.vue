<template>
<nav class="navigation">
    <Icon
    type="adjust"
    class="icon icon--hide"
    :class="rotateIcon"
    :width="`0.9rem`"
    :height="`0.9rem`"
    :borderStyles="true"
    @click="toggleTheme"
    />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { faAdjust } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Icon from "./Icon.vue";
library.add([faAdjust] as any);

export default defineComponent({
  name: "NavBar",
  components: {
    Icon
  },
  data: function () {
    return {
        theme: '',
    };
  },
    methods: {
        toggleTheme: function(): void {
        let newTheme = this.themeColor == 'darkMode' ? '' : 'darkMode'; //toggles theme value
        document.documentElement.setAttribute('data-theme', newTheme); // sets the data-theme attribute
        localStorage.setItem('theme', newTheme); // stores theme value on local storage
        this.$emit("updateTheme", newTheme)
    }},
    computed: {
        rotateIcon: function(): string {
        let styleObj: string;
        switch (this.theme == 'darkMode'){
        case true:
            styleObj=  "rotateIcon";
            break
        case false:
            styleObj = "noRotateIcon";
            break
        }
        return styleObj
        }
    },
    props: {
        themeColor: {
            type: String,
        }
    }
  

});
</script>

<style scoped>

.rotateIcon {
  transform: rotate(180deg)
}
.noRotateIcon {
  transform: rotate(0)
}
.icon{ 
  color: white;
  animation: transform .3s ease;
}
.navigation{
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: rgb(0, 0, 0);
  height: 40px;
}
</style>
