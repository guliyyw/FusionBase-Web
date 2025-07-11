import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

import './assets/tailwind.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Toast, {
    position: 'top-right',
    duration: 3000,
    dismissible: true
})
// 先挂载应用
app.mount('#app')

// 然后在已挂载的应用上初始化用户
store.dispatch('user/initialize').catch(error => {
    console.error('用户初始化失败:', error)
})