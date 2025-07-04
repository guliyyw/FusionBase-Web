import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'  // 添加 .js 扩展名

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')