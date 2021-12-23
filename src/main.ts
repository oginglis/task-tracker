import { createApp } from 'vue';
import App from './App.vue'
import vClickOutside from "./common/directives/clickoutside"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createMetaManager } from 'vue-meta'
import directives from "./common/directives";
// javascript import for when you're importing the css directly in your javascript


const app = createApp(App)

directives(app);

app.directive('clickOutside', vClickOutside)

app.use(createMetaManager()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
