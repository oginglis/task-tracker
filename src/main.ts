import Vue, { createApp } from 'vue';
import App from './App.vue'
import { createMetaManager } from 'vue-meta'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



Vue

createApp(App).use(vClickOutside).use(createMetaManager()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
