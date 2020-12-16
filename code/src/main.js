import Vue from 'vue'
import iView from 'iview'
import App from '@/App'
import Vuex from 'vuex'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import 'iview/dist/styles/iview.css'
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import qs from 'qs'
import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['sso_token'] = Cookies.get('sso_token')?Cookies.get('sso_token'):''
axios.defaults.headers.common['sso_token_account'] = Cookies.get('sso_token_account')?Cookies.get('sso_token_account'):''
axios.defaults.headers.common['SESSION'] = Cookies.get('SESSION')?Cookies.get('SESSION'):''
axios.defaults.baseURL = 'http://localhost:8000/exhibition-server'
axios.defaults.withCredentials=true
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
Vue.use(VueCookie)
Vue.use(iView)
Vue.use(Vuex)
Vue.config.productionTip = false


// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
