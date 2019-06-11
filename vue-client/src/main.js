import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/js/flexible'
import '@/assets/js/http'
import axios from 'axios'
import '@/assets/css/base.css'
import { Button, Cell, NavBar, Toast, Dialog, List, Icon, Tab, Tabs, Panel  } from 'vant'

Vue.component('Button', Button)
Vue.component('Cell', Cell)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(Dialog)
Vue.use(List)
Vue.use(Icon)
Vue.use(Tab).use(Tabs)
Vue.use(Panel)
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
