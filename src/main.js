// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/HalOutliner'
import Util from './assets/util'
import MyStore from './assets/store'
import Vuex from 'vuex'
import 'es6-promise/auto'

Vue.config.productionTip = false
Vue.mixin(Util)

Vue.use(Vuex)
const store = new Vuex.Store(MyStore)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
