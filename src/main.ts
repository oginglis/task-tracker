import { createApp } from 'vue';
import App from './App.vue'
import vClickOutside from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createMetaManager } from 'vue-meta'
import directives from "./directives/";

const app = createApp(App)

directives(app);

app.directive('clickOutside', vClickOutside)

app.use(createMetaManager()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
