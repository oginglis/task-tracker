import Vue, { createApp } from 'vue';
import App from './App.vue'
import VueMeta from 'vue-meta'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(vClickOutside)
Vue.use(VueMeta)

Vue.component('font-awesome-icon', FontAwesomeIcon)

createApp(App).mount('#app')
