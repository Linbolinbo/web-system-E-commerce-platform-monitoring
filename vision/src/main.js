import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/font/iconfont.css'
import './assets/css/global.less'
import axios from 'axios'
// 对服务端进行websocket的连接
// import SocketService from '@/utils/socket_service'
// SocketService.Instance.connect()
// 其他组件this.$socket调用
// Vue.prototype.$socket = SocketService.Instance
// 请求根路劲配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// axios挂载到Vue原型上
Vue.prototype.$http = axios
// 全局echarts对象挂载到Vue原型上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
