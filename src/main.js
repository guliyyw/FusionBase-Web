import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/tailwind.css'

const app = createApp(App)

app.use(store)
app.use(router)

store.dispatch('user/initialize').then(() => {
    app.mount('#app')
}).catch(error => {
    console.error('初始化失败:', error)
    app.mount('#app') // 即使失败也挂载应用
})