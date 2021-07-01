import Vue, { createApp } from 'vue';
import App from './App.vue'
import VueMeta from 'vue-meta'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



Vue

createApp(App).use(vClickOutside).use(VueMeta).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
