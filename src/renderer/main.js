import Vue from 'vue'

import App from './App'
import router from './router'
import viewUI, { Modal, Message } from 'view-design'
import 'view-design/dist/styles/iview.css'
import locale from 'view-design/dist/locale/zh-CN'
import './plugins'

Vue.use(viewUI, { locale })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
if (!process.env.IS_WEB) Vue.use(require('view-design'))
Vue.remoteService = Vue.prototype.$remoteService = require('electron').remote.getGlobal('services')

Vue.prototype.$modal = Modal
Vue.prototype.$message = Message
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
