import Vue from 'vue'
import App from './App.vue'
import router from 'router/router'
import store from 'store/store'
import * as utils from 'utils/utils'
import * as api from 'service/apiList'
import * as _ from 'lodash'
import 'assets/css/common.less'
import Sun from 'components/Sun'
import mixin from 'utils/mixin.js'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant)
Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$api = api
Vue.prototype._ = _
Vue.component('Sun', Sun)
Vue.mixin(mixin) //全局混入
Vue.prototype.$bus = new Vue()
const state = Vue.observable({
  count: 0
})
// Vue.directive('focus', {
//   inserted: (el) => {
//     el.focus()
//   }
// })
// Vue.directive('focus', {
//   inserted: (el) => {
//     el.focus()
//   }
// })
Vue.filter('cas', (val) => {
  return val.charAt(0).toUpperCase() + val.slice(1)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
