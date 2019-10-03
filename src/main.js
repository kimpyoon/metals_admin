import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import { getToken, removeToken } from '@/utils/auth'
import axios from 'axios'
import VCharts from 'v-charts'
Vue.use(VCharts)
Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api'
}

axios.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.config.url.indexOf('export') > -1) {
      // 下载时需要用到header拿文件名
      return response
    } else {
      return response.data
    }
  },
  error => {
    if (error.response.status === 401) {
      removeToken()
      const err = {
        errmsg: '用户已下线，请重新登录'
      }
      router.replace('/login')
      return Promise.reject(err)
    } else if (error.response.status === 403) {
      router.replace('/403')
    } else if (error.response.status === 504) {
      Vue.prototype.$message.error('网络超时,请检查网络')
    } else {
      return Promise.reject(error.response.data)
    }
  })
Vue.prototype.$axios = axios

router.beforeEach((to, from, next) => {
  if (!getToken() && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
