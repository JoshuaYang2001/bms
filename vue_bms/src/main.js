import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'



// 本地服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios

axios.interceptors.request.use(config => {
// 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
