import { createApp } from 'vue';
import App from './App.vue'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createMetaManager } from 'vue-meta'

createApp(App).use(vClickOutside).use(createMetaManager()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
