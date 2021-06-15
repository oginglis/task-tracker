import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueMeta)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
