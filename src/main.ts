import { createApp } from 'vue';
import App from './App.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createMetaManager } from 'vue-meta'
import directives from "./directives/";

const app = createApp(App)

directives(app);



app.use(createMetaManager()).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
