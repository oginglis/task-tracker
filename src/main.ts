import { createApp } from 'vue';
import App from './App.vue'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'





createApp(App).use(vClickOutside).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
