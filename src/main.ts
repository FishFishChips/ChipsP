import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//引入路由实例
import router from './router' 
//引入全局样式
import "./styles/global.css"
//挂载pinia全局状态管理
import { createPinia } from 'pinia'
//引入pinia全局状态持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//引入Material Design Icons图标库样式
import '@mdi/font/css/materialdesignicons.css' 

const app = createApp(App)//创建Vue应用实例
const pinia = createPinia() //创建pinia实例
pinia.use(piniaPluginPersistedstate) //注册插件

app.use(router) //安装路由插件
app.use(pinia) //使用pinia
app.mount('#app') //挂载应用实例到DOM


