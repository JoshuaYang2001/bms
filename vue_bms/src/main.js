import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'



// 二次封装过的axios
// import {reqLogin} from '@/api'
// reqLogin()

// 配置请求根路径
// 本地服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8080/'
// axios.defaults.baseURL = ''
// axios.defaults.baseURL = 'http://localhost:8080/login'
// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
