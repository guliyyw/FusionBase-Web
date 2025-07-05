import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'

import './assets/tailwind.css'

// 创建Vue实例前直接初始化store
store.dispatch('initialize').then(() => {
    console.log("create app")
    const app = createApp(App)

    app.use(store)
    app.use(router)

    app.mount('#app')

    store.dispatch('initialize')
})